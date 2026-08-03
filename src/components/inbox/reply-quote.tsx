"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { useTranslations } from "next-intl";

interface ReplyQuoteProps {
  /** Sender label of the quoted message: "You" for our own messages,
   *  contact name for customer-sent messages. Caller resolves this — the
   *  quote component doesn't see the parent Message. */
  authorLabel: string;
  /** Compact text preview. Falls back to a placeholder for media types. */
  preview: string;
  /** Present → renders the composer-chip variant with an X button. Absent →
   *  renders the embedded-in-bubble variant. */
  onDismiss?: () => void;
  /** True when embedded inside an outbound (primary-filled) bubble, so the
   *  quote must read against the primary surface rather than the neutral
   *  foreground — otherwise it goes low-contrast in light mode. */
  onPrimary?: boolean;
}

export function ReplyQuote({
  authorLabel,
  preview,
  onDismiss,
  onPrimary = false,
}: ReplyQuoteProps) {
  const t = useTranslations("Inbox.replyQuote");
  const isChip = !!onDismiss;

  return (
    <div
      className={cn(
        "mb-2 flex items-start gap-3 border-l-4 pl-2 pr-3 pt-2 transition-colors duration-200",

        onPrimary
          ? `
            border-l-emerald-600
            bg-emerald-50/90

            dark:border-l-emerald-500
            dark:bg-emerald-950/20
          `
          : `
            border-l-sky-600
            bg-slate-50/90

            dark:border-l-sky-500
            dark:bg-slate-800/50
          `,

        isChip &&
          `
            bg-slate-100

            dark:bg-slate-800
          `,
      )}
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "mb-1 text-xs font-semibold",

            onPrimary
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-sky-700 dark:text-sky-300",
          )}
        >
          {authorLabel}
        </div>

        <div
          className="
            whitespace-pre-wrap
            break-words
            text-[13px]
            leading-6
            text-slate-700

            dark:text-slate-300
          "
        >
          {preview}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t("cancelReply")}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg

            text-slate-400

            hover:bg-slate-200
            hover:text-slate-700

            dark:text-slate-500
            dark:hover:bg-slate-700
            dark:hover:text-slate-200
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** Build the one-line preview text shown inside a reply quote. */
export function buildReplyPreview(message: Message, t: ReturnType<typeof useTranslations>): string {
  if (message.content_text) return message.content_text;
  switch (message.content_type) {
    case "image":
      return t("photo");
    case "video":
      return t("video");
    case "audio":
      return t("audio");
    case "document":
      return t("document");
    case "location":
      return t("location");
    case "template":
      return t("template");
    default:
      return t("message");
  }
}
