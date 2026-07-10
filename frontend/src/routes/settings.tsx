import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endpoints } from "@/lib/api/endpoints";
import type { AppSettings } from "@/lib/api/types";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — AI Data Analyst" }] }),
});

const DEFAULTS: AppSettings = {
  groq_model: "llama-3.3-70b-versatile",
  temperature: 0.2,
  language: "en",
  theme: "system",
  automation_enabled: true,
  voice_enabled: true,
  notifications_enabled: true,
};

function SettingsPage() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["settings"],
    queryFn: endpoints.getSettings,
    retry: false,
  });
  const [form, setForm] = useState<AppSettings>(DEFAULTS);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (q.data) setForm(q.data);
  }, [q.data]);

  const save = useMutation({
    mutationFn: (payload: Partial<AppSettings>) =>
      endpoints.updateSettings(payload),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-3xl p-6">
      <PageHeader
        title="Settings"
        description="Configure model, voice, and workspace."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Groq model</Label>
              <Select
                value={form.groq_model}
                onValueChange={(v) => update("groq_model", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama-3.3-70b-versatile">
                    Llama 3.3 70B Versatile
                  </SelectItem>
                  <SelectItem value="llama-3.1-70b">Llama 3.1 70B</SelectItem>
                  <SelectItem value="mixtral-8x7b">Mixtral 8x7B</SelectItem>
                  <SelectItem value="gemma2-9b">Gemma 2 9B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {form.temperature.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[form.temperature]}
                onValueChange={([v]) => update("temperature", v)}
                min={0}
                max={1}
                step={0.05}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Input
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                placeholder="en"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark mode</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle app theme.
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              label="Enable automation"
              description="Allow the agent to run automation workflows."
              value={form.automation_enabled}
              onChange={(v) => update("automation_enabled", v)}
            />
            <Toggle
              label="Voice input"
              description="Enable microphone recording in chat."
              value={form.voice_enabled}
              onChange={(v) => update("voice_enabled", v)}
            />
            <Toggle
              label="Notifications"
              description="Notify me when reports and forecasts finish."
              value={form.notifications_enabled}
              onChange={(v) => update("notifications_enabled", v)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => save.mutate(form)} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
