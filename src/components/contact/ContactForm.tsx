"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contactCopy, site } from "@/content/site";
import { Arrow } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "peer w-full border-0 border-b border-ink/20 bg-transparent px-0 pt-7 pb-3 text-lg text-ink placeholder-transparent transition-colors focus:border-brand focus:ring-0 focus:outline-none";
const label =
  "pointer-events-none absolute top-7 left-0 origin-left text-lg text-ink/50 transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (String(data.get("name") ?? "").trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") ?? "").trim())) errors.email = "Please enter a valid email address.";
  if (String(data.get("message") ?? "").trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [interest, setInterest] = useState<string>(contactCopy.interests[0]);
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[32rem] flex-col items-start justify-center"
            role="status"
          >
            <motion.svg viewBox="0 0 52 52" className="size-16 text-brand" aria-hidden>
              <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
              <motion.path d="M15 27l7 7 15-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6 }} />
            </motion.svg>
            <h2 className="mt-8 text-4xl font-semibold tracking-tight">Thank you — message received.</h2>
            <p className="mt-4 max-w-md text-ink/65">Our team will be in touch shortly. For anything urgent, email {site.contact.email}.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm font-medium text-brand underline underline-offset-4">
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
            aria-describedby="form-note"
          >
            <fieldset>
              <legend className="eyebrow mb-4 text-ink/60">I’m interested in</legend>
              <div className="flex flex-wrap gap-2">
                {contactCopy.interests.map((opt) => (
                  <label key={opt} className="relative cursor-pointer">
                    <input type="radio" name="interest" value={opt} checked={interest === opt} onChange={() => setInterest(opt)} className="peer sr-only" />
                    <span className="block rounded-full border border-ink/20 px-4 py-2 text-sm transition-colors duration-300 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan hover:border-ink/50">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-8 md:grid-cols-2">
              <Field name="name" label="Your name *" autoComplete="name" error={errors.name} />
              <Field name="organization" label="Organisation" autoComplete="organization" />
              <Field name="email" type="email" label="Email *" autoComplete="email" error={errors.email} />
              <Field name="phone" type="tel" label="Phone" autoComplete="tel" />
            </div>

            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Message"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`${field} resize-none`}
              />
              <label htmlFor="message" className={label}>
                How can we work together? *
              </label>
              {errors.message && (
                <p id="message-error" className="mt-2 text-sm text-red-700">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Honeypot for bots */}
            <div aria-hidden className="absolute -left-[9999px]">
              <label>
                Leave this empty
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p id="form-note" className="text-xs text-ink/50">
                Fields marked * are required. We’ll only use your details to respond.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper disabled:opacity-60"
              >
                <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-brand transition-transform duration-700 ease-(--ease-expo) group-hover:translate-y-0" />
                <span className="relative">{status === "sending" ? "Sending…" : "Send message"}</span>
                <Arrow className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>
            <div aria-live="polite">
              {status === "error" && (
                <p className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-800">
                  {serverError} You can also reach us at{" "}
                  <a className="underline" href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </a>
                  .
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ name, label: text, type = "text", autoComplete, error }: { name: string; label: string; type?: string; autoComplete?: string; error?: string }) {
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        placeholder={text}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={field}
      />
      <label htmlFor={name} className={label}>
        {text}
      </label>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
