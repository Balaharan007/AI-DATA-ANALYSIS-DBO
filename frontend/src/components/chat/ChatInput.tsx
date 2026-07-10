import { useRef, useState } from "react";
import { Mic, Paperclip, Send, Square } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChatInput({
  onSend,
  onVoice,
  onFile,
  disabled,
}: {
  onSend: (text: string) => void;
  onVoice?: (blob: Blob) => void;
  onFile?: (file: File) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [recording, setRecording] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  };

  const toggleRecord = async () => {
    if (recording) {
      recRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) =>
        e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onVoice?.(blob);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  return (
    <div className="relative rounded-2xl border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask about your data, generate a chart, forecast, or run SQL…"
        rows={2}
        className="min-h-[70px] resize-none border-0 bg-transparent px-4 py-3 pr-2 text-sm shadow-none focus-visible:ring-0"
        disabled={disabled}
      />
      <div className="flex items-center justify-between border-t px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv,.pdf,.docx,.doc,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff"
            onChange={(e) => e.target.files?.[0] && onFile?.(e.target.files[0])}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn("h-8 w-8", recording && "text-destructive")}
            onClick={toggleRecord}
            aria-label="Voice"
          >
            {recording ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          {recording && (
            <span className="ml-1 flex items-center gap-1 text-xs text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              Listening…
            </span>
          )}
        </div>
        <Button size="sm" onClick={submit} disabled={disabled || !value.trim()}>
          <Send className="mr-1 h-3.5 w-3.5" /> Send
        </Button>
      </div>
    </div>
  );
}
