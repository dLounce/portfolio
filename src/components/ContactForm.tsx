"use client";

import { useRef, useState } from "react";
import {
  MESSAGE_MAX,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact";

const EMAIL = "rrishavrraj@gmail.com";

type Status = "idle" | "sending" | "sent" | "error" | "offline" | "limited";

const inputClass =
  "w-full rounded-[4px] border bg-paper px-[13px] py-[10px] text-[16px] leading-[1.5] text-ink placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const labelClass = "mb-[7px] block font-mono text-[11px] tracking-[0.12em] text-note uppercase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, real visitors never see it
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState<{ name: string; email: string } | null>(null);

  // Set the first time the visitor touches the form; the server uses it to
  // ignore submissions that arrive faster than a person could type them.
  const startedAt = useRef(0);

  const sending = status === "sending";

  function fieldProps(field: ContactField) {
    const err = errors[field];
    return {
      id: `contact-${field}`,
      name: field,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `contact-${field}-err` : undefined,
      className: `${inputClass} ${err ? "border-fail" : "border-rule"}`,
    };
  }

  function fieldError(field: ContactField) {
    const err = errors[field];
    if (!err) return null;
    return (
      <p id={`contact-${field}-err`} className="mt-[6px] text-[14px] leading-[1.4] text-fail">
        {err}
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const values = { name: name.trim(), email: email.trim(), message: message.trim() };
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (["name", "email", "message"] as const).find((f) => found[f]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
      });
      const data: { status?: string; errors?: ContactErrors } = await res.json().catch(() => ({}));

      if (res.ok && data.status === "ok") {
        setSentTo({ name: values.name, email: values.email });
        setName("");
        setEmail("");
        setMessage("");
        setStatus("sent");
      } else if (data.status === "offline") {
        setStatus("offline");
      } else if (data.status === "rate_limited") {
        setStatus("limited");
      } else if (data.status === "invalid_input" && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setSentTo(null);
    setErrors({});
    setStatus("idle");
    startedAt.current = 0;
  }

  if (status === "sent" && sentTo) {
    return (
      <div role="status" className="rounded-[6px] border border-rule bg-card px-[22px] py-[24px]">
        <p className="font-mono text-[11px] tracking-[0.12em] text-ok uppercase">Message sent</p>
        <p className="mt-[8px] text-[22px] leading-[1.25] font-bold tracking-[-0.01em] text-ink">
          Thanks, {sentTo.name.split(" ")[0]}.
        </p>
        <p className="mt-[8px] max-w-[52ch] text-[16.5px] text-mute">
          Your message is in my inbox. I&apos;ll reply to you at{" "}
          <span className="font-mono text-[14.5px] [overflow-wrap:anywhere] text-body">
            {sentTo.email}
          </span>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-[16px] cursor-pointer font-mono text-[12px] text-accent underline-offset-[5px] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Message from ${name.trim() || "your portfolio"}`,
  )}&body=${encodeURIComponent(message.trim())}`;

  return (
    <form
      onSubmit={onSubmit}
      onFocus={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      noValidate
      className="rounded-[6px] border border-rule bg-card px-[22px] py-[22px] max-[560px]:px-[16px]"
    >
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[18px] max-[560px]:grid-cols-1">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Your email
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldError("email")}
        </div>

        <div className="col-span-2 max-[560px]:col-span-1">
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            {...fieldProps("message")}
            rows={6}
            maxLength={MESSAGE_MAX}
            placeholder="What are you hiring for, and what would you like to talk about?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ resize: "vertical" }}
          />
          <div className="mt-[6px] flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">{fieldError("message")}</div>
            <span className="shrink-0 font-mono text-[12px] text-faint tabular-nums">
              {message.length} / {MESSAGE_MAX}
            </span>
          </div>
        </div>
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mt-[20px] flex flex-wrap items-center gap-x-[18px] gap-y-[12px]">
        <button
          type="submit"
          disabled={sending}
          className="cursor-pointer rounded-[4px] bg-accent px-[22px] py-[11px] font-mono text-[12.5px] tracking-[0.08em] text-card uppercase transition-colors hover:bg-ink disabled:cursor-default disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
        <p className="font-mono text-[12px] leading-[1.5] text-note">
          Goes straight to my inbox.
        </p>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {status === "error" && (
          <p className="mt-[16px] text-[15.5px] leading-[1.5] text-fail">
            That didn&apos;t go through. Your message is still here, so you can try again, or email me
            at{" "}
            <a href={mailto} className="text-accent underline underline-offset-[4px]">
              {EMAIL}
            </a>
            .
          </p>
        )}
        {status === "offline" && (
          <p className="mt-[16px] text-[15.5px] leading-[1.5] text-body">
            The form isn&apos;t accepting messages right now. Your text is still here:{" "}
            <a href={mailto} className="text-accent underline underline-offset-[4px]">
              open it in your email app
            </a>{" "}
            or write to {EMAIL}.
          </p>
        )}
        {status === "limited" && (
          <p className="mt-[16px] text-[15.5px] leading-[1.5] text-body">
            That&apos;s a few messages in a short time. Please wait a few minutes and try again, or
            email me at{" "}
            <a href={mailto} className="text-accent underline underline-offset-[4px]">
              {EMAIL}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
