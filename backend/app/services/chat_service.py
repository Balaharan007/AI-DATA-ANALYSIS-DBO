from __future__ import annotations

from typing import Optional

import pandas as pd
from fastapi import HTTPException

from .. import groq_client
from ..storage import new_id, now_iso, store
from . import analysis, dataset_service

VALID_ACTIONS = {"analyze", "chart", "anomaly", "forecast", "sql", "pandas", "report"}


def _step(id_: str, label: str, status: str, detail: Optional[str] = None) -> dict:
    return {"id": id_, "label": label, "status": status, "detail": detail}


def classify_intent(message: str, has_dataset: bool) -> str:
    if not has_dataset:
        return "chat"
    prompt = f"""Classify the user's data-analyst request into exactly one label:
analyze | chart | anomaly | forecast | sql | pandas | report | chat

- analyze: general question, summary, insight request about the data
- chart: explicit request to visualize/plot/graph
- anomaly: request to find outliers/anomalies/unusual values
- forecast: request to predict/forecast future values/trends
- sql: explicit request for a SQL query
- pandas: explicit request for pandas/python code
- report: request to generate a report/document/summary export
- chat: general conversation unrelated to the dataset

Respond with only the single label word.
Message: "{message}"
"""
    try:
        label = groq_client.chat_completion(
            [{"role": "user", "content": prompt}], temperature=0.0, max_tokens=10
        ).strip().lower()
        label = "".join(c for c in label if c.isalpha())
        if label in VALID_ACTIONS or label == "chat":
            return label
    except Exception:
        pass
    return "analyze"


NARRATOR_SYSTEM_PROMPT = """You are Ada, an expert AI data analyst embedded in a BI product. Your job is to make answers easy to scan on a first read. Always follow this strict structure:

1. **📝 Headline Summary** — Start with a single bold sentence (max 50 words) stating the single most important finding. No header above it.
2. **📋 Key Numbers** — A bulleted section (### 📋 Key Points) of the most important metrics. Each bullet must start with a **green dot** followed by bolded metric name. Use this exact format: `• **MetricName**: value and context`.
3. **📈 Analysis** — If relevant, a section (### 📈 Analysis) with short bullet points (each starting with `• `) explaining trends, patterns, or comparisons. Bold column names.
4. **⚠️ Anomalies / Risks** — If anomalies, outliers, or risks are found, list with `• ` bullets in a dedicated section (### ⚠️ Risks or ### ⚠️ Anomalies). If none, skip.
5. **🔮 Outlook** — For forecasting queries, include (### 🔮 Outlook) with predicted direction and caveats.
6. **💡 Recommendation** — (Optional) A single short recommendation bullet starting with `• `.

Formatting rules (CRITICAL — follow every rule):
- Begin every bullet point with a **green dot** `• ` followed by a space, then the content.
- Always use **bold** for column names, metric names, and key numbers.
- Use emoji headers: `### 📋 Key Points`, `### 📈 Analysis`, `### ⚠️ Anomalies`, etc.
- Prefer short bullet points over paragraphs. NEVER write long prose paragraphs.
- When comparing values or categories, use a markdown table with aligned columns.
- Be concise, business-friendly, and always cite specific numbers from the data (never invent).
- Remember earlier turns in this conversation and stay consistent.
- If more than one dataset is in context, be explicit about which file each number came from.
- NEVER repeat the user's question back — just answer it.
- Keep total response focused: 100-300 words unless the user asks for detail.
- When explaining a chart: say what the chart type is, the x-axis, the y-axis, aggregation used, and the headline takeaway in 2-3 sentences."""


def _narrate(question: str, context: str, conv_id: str) -> str:
    history = store.get_conversation(conv_id)
    messages = [
        {"role": "system", "content": NARRATOR_SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": f"{context}\n\nUser question: {question}"},
    ]
    return groq_client.chat_completion(messages, temperature=0.4, max_tokens=900)


def handle_chat(message: str, dataset_id: Optional[str], conversation_id: Optional[str], action: Optional[str]) -> dict:
    conv_id = conversation_id or new_id("conv_")
    df, records = dataset_service.get_context_df(dataset_id)
    steps: list[dict] = [_step("plan", "Understanding request", "completed")]
    blocks: list[dict] = []

    has_dataset = df is not None and not df.empty
    intent = action if action in VALID_ACTIONS else classify_intent(message, has_dataset)

    if not has_dataset and intent != "chat":
        blocks.append(
            {
                "type": "text",
                "text": (
                    "I don't have an active dataset to work with yet. Please upload one or more "
                    "CSV/Excel files (or an image of a table), then select them from the sidebar "
                    f"before asking me to {intent} the data. I can also work across several files "
                    "at once if you select more than one."
                ),
            }
        )
        steps.append(_step("done", "Waiting for dataset", "failed"))
        return _finish(conv_id, message, blocks, steps)

    try:
        if intent == "chart":
            steps.append(_step("tool", "Building chart", "running"))
            spec = analysis.build_chart_spec(df, message, None)
            steps[-1]["status"] = "completed"
            narration = _narrate(
                message,
                f"You just generated a '{spec['type']}' chart titled '{spec['title']}'. "
                f"The x-axis shows '{spec.get('x_key', 'N/A')}' and the y-axis shows "
                f"{', '.join(spec.get('y_keys', []))} with {spec.get('meta', {}).get('agg', 'raw')} aggregation. "
                f"Chart description: {spec.get('description', 'See chart for details.')} "
                f"Explain in 2-3 sentences what this chart reveals and key takeaways.",
                conv_id,
            )
            blocks.append({"type": "text", "text": narration})
            blocks.append({"type": "chart", "chart": spec})

        elif intent == "anomaly":
            steps.append(_step("tool", "Scanning for anomalies", "running"))
            records_out, summary = analysis.detect_anomalies(df)
            steps[-1]["status"] = "completed"
            explanation = _narrate(
                message,
                f"Anomaly detection result: {summary}\nSample flagged rows: {records_out[:5]}",
                conv_id,
            )
            blocks.append({"type": "text", "text": explanation})
            if records_out:
                cols = list(records_out[0].keys())
                blocks.append({"type": "table", "columns": cols, "rows": records_out[:50]})
            blocks.append({"type": "reasoning", "text": summary})

        elif intent == "forecast":
            steps.append(_step("tool", "Forecasting trend", "running"))
            spec = analysis.forecast(df, message)
            steps[-1]["status"] = "completed"
            # Extract target from spec meta for narration
            target = spec.get("meta", {}).get("target_feature", "the requested metric")
            method = spec.get("meta", {}).get("method", "prophet")
            horizon = spec.get("meta", {}).get("horizon", 6)

            narration = _narrate(
                message,
                f"You forecast '{target}' using {method} model "
                f"for the next {horizon} periods. Explain the trend, confidence intervals, "
                f"and caveat that this is a projection based on historical patterns.",
                conv_id,
            )
            blocks.append({"type": "text", "text": narration})
            blocks.append({"type": "chart", "chart": spec})

        elif intent == "sql":
            steps.append(_step("tool", "Generating SQL", "running"))
            sql = analysis.generate_sql(df, message)
            try:
                result_df = analysis.run_sql({"df": df}, sql)
                steps[-1]["status"] = "completed"
                blocks.append({"type": "code", "language": "sql", "code": sql})
                if not result_df.empty:
                    blocks.append(
                        {
                            "type": "table",
                            "columns": list(result_df.columns),
                            "rows": analysis._safe_records(result_df.head(100)),
                        }
                    )
                blocks.append(
                    {
                        "type": "reasoning",
                        "text": f"Query executed against {df.shape[0]} rows, returned {len(result_df)} row(s).",
                    }
                )
            except Exception as e:
                steps[-1]["status"] = "failed"
                blocks.append({"type": "code", "language": "sql", "code": sql})
                blocks.append({"type": "text", "text": f"The generated SQL failed to execute: {e}"})

        elif intent == "pandas":
            steps.append(_step("tool", "Generating pandas code", "running"))
            code = analysis.generate_pandas_code(df, message)
            try:
                result = analysis.run_pandas_code(df, code)
                steps[-1]["status"] = "completed"
                blocks.append({"type": "code", "language": "python", "code": code})
                if isinstance(result, pd.DataFrame):
                    blocks.append(
                        {
                            "type": "table",
                            "columns": list(result.columns),
                            "rows": analysis._safe_records(result.head(100)),
                        }
                    )
                else:
                    blocks.append({"type": "text", "text": f"Result: {result}"})
            except Exception as e:
                steps[-1]["status"] = "failed"
                blocks.append({"type": "code", "language": "python", "code": code})
                blocks.append({"type": "text", "text": f"The generated code failed to execute: {e}"})

        elif intent == "report":
            steps.append(_step("tool", "Generating report", "running"))
            from . import report_service

            ds_id = dataset_id.split(",")[0] if dataset_id else records[0]["id"]
            report = report_service.generate_report(ds_id, message)
            steps[-1]["status"] = "completed"

            base_url = "http://localhost:8000"
            full_download_url = f"{base_url}{report['url']}"
            blocks.append(
                {
                    "type": "text",
                    "text": f"I generated a report: **{report['name']}**. You can download it [here]({full_download_url}) or find it in the Reports section.",
                }
            )
            blocks.append({"type": "pdf", "url": full_download_url, "name": report["name"]})

        else:  # analyze or chat
            steps.append(_step("tool", "Analyzing data" if has_dataset else "Thinking", "running"))
            context = (
                f"Active file(s): {', '.join(r['name'] for r in records)}\n"
                f"Combined dataset profile:\n{analysis.df_profile_text(df)}"
                if has_dataset
                else "No dataset is loaded."
            )
            narration = _narrate(message, context, conv_id)
            steps[-1]["status"] = "completed"
            blocks.append({"type": "text", "text": narration})

    except Exception as e:
        steps.append(_step("error", "Something went wrong", "failed", detail=str(e)))
        blocks.append({"type": "text", "text": f"I ran into an error while working on that: {e}"})

    return _finish(conv_id, message, blocks, steps)


def _finish(conv_id: str, user_message: str, blocks: list[dict], steps: list[dict]) -> dict:
    store.append_conversation(conv_id, "user", user_message)
    text_summary = " ".join(b.get("text", "") for b in blocks if b.get("type") in ("text", "reasoning"))[:2000]
    store.append_conversation(conv_id, "assistant", text_summary or "(non-text response generated)")

    message = {
        "id": new_id("msg_"),
        "role": "assistant",
        "created_at": now_iso(),
        "blocks": blocks,
        "execution": steps,
    }
    store.add_history(
        {
            "id": new_id("hist_"),
            "kind": "conversation",
            "title": user_message[:80],
            "created_at": message["created_at"],
            "meta": {"conversation_id": conv_id},
        }
    )
    return {"conversation_id": conv_id, "message": message}
