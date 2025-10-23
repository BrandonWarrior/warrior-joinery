// src/components/forms/contactform.tsx
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name (at least 2 characters)."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(10, "Please add a short message (10+ characters)."),
  // Honeypot: optional client-side; we screen on server
  company: z.string().optional(),
  submittedAt: z.number().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const navigate = useNavigate();
  const mountedAtRef = useRef<number>(Date.now());
  const [status, setStatus] = useState<null | { type: "ok" | "error"; msg: string }>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setValue,
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  async function onValid(data: FormData) {
    setStatus(null);
    // set programmatically; do NOT register as an input
    setValue("submittedAt", Date.now());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mountedAt: mountedAtRef.current }),
      });

      if (res.ok) {
        reset();
        setStatus({ type: "ok", msg: "Sent — taking you to the thank-you page…" });
        navigate("/thank-you");
      } else {
        let msg = "Something went wrong, please try again.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {}
        setStatus({ type: "error", msg });
      }
    } catch (e) {
      console.error("[contact] network error", e);
      setStatus({ type: "error", msg: "Could not send. Check your connection and try again." });
    }
  }

  function onInvalid() {
    // surface field errors now
    trigger();
    // Helpful while we’re finishing setup:
    if (import.meta.env.DEV) console.log("[contact] validation errors", errors);
    setStatus({ type: "error", msg: "Please fix the highlighted fields and try again." });
  }

  return (
    <form noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="mx-auto max-w-lg space-y-4">
      {/* Status */}
      <div aria-live="polite">
        {status?.type === "ok" && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-800">
            {status.msg}
          </div>
        )}
        {status?.type === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800">
            {status.msg}
          </div>
        )}
      </div>

      {/* Honeypot (hidden & ignored by screen readers) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          {...register("company")}
          defaultValue=""
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone (optional)</label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel"
        />
        {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {import.meta.env.DEV && !isSubmitSuccessful && (
        <p className="text-xs text-neutral-500">DEV: open the Console to see submit logs.</p>
      )}
    </form>
  );
}
