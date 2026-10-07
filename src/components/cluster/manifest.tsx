"use client";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ClusterManifest({ yaml }: { yaml: string }) {
  const translations = { manifest: useTranslations("manifest") };
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error(translations.manifest("copyError"));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{translations.manifest("title")}</p>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? translations.manifest("copied") : translations.manifest("copy")}
        </Button>
      </div>
      <div className="bg-card overflow-x-auto rounded-lg border">
        <pre className="p-4 font-mono text-[12.5px] leading-relaxed">{yaml}</pre>
      </div>
    </div>
  );
}
