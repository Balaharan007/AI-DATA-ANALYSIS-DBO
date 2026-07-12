import { createFileRoute } from '@tanstack/react-router'
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
import { useAuth } from "@/context/AuthContext";
import { Loader2, Send, Bot } from "lucide-react";

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

        {/* Telegram Bot Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Telegram Bot Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TelegramSettings />
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

function TelegramSettings() {
  const { user } = useAuth();
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      checkTelegramConfig();
    }
  }, [user]);

  const checkTelegramConfig = async () => {
    try {
      // Test connection by sending a test message
      const result = await endpoints.testTelegramConnection();
      setTelegramConfigured(result.success);
      setTestResult(result);
    } catch (e) {
      console.error("Failed to check Telegram config:", e);
      setTelegramConfigured(false);
    }
  };

  const handleTestConnection = async () => {
    if (!user) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await endpoints.testTelegramConnection();
      setTelegramConfigured(result.success);
      setTestResult(result);
      if (result.success) {
        toast.success("Test message sent to Telegram!");
      } else {
        toast.error(result.message || "Failed to send test message");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to test Telegram connection");
      setTestResult({ success: false, message: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Please sign in to configure Telegram.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Telegram Bot</Label>
          <p className="text-xs text-muted-foreground">
            Send generated reports (PDF & DOCX) automatically to a Telegram chat/group.
          </p>
        </div>
        {telegramConfigured ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Bot className="h-3.5 w-3.5" />
              Connected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="mr-1 h-3.5 w-3.5" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <span className="text-sm">Not configured</span>
            <span className="text-xs">(requires backend config)</span>
          </div>
        )}
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <p>
          <strong>Bot Token:</strong> Configured in backend .env (TELEGRAM_BOT_TOKEN)
        </p>
        <p>
          <strong>Chat ID:</strong> Configured in backend .env (TELEGRAM_CHAT_ID)
        </p>
        <p>
          To get your Chat ID: Message your bot, then visit{' '}
          <code>{"https://api.telegram.org/bot<TOKEN>/getUpdates"}</code>
        </p>
      </div>

      {testResult && (
        <div
          className={`p-3 rounded text-xs ${
            testResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {testResult.message}
        </div>
      )}
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