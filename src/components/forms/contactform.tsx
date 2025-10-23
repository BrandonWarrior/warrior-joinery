
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { track } from "../../lib/analytics";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please include a short message"),
  company: z.string().max(0).optional(),   // honeypot (ignored by server)
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
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  async function onSubmit(data: FormData) {
    setStatus(null);
    setValue("submittedAt", Date.now());

    try {
      if (import.meta.env.DEV) {
        console.log("DEV payload:", { ...data, mountedAt: mountedAtRef.current });
        await new Promise((r) => setTimeout(r, 300));
        reset();
        track?.("generate_lead", { form: "contact", mode: "dev" });
        navigate("/thank-you");
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mountedAt: mountedAtRef.current }),
      });

      if (res.ok) {
        reset();
        setStatus({ type: "ok", msg: "Sent — taking you to the thank-you page…" });
        track?.("generate_lead", { form: "contact" });
        navigate("/thank-you");
      } else {
        let msg = "Something went wrong, please try again.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          const t = await res.text().catch(() => "");
          if (t) msg = t;
        }
        console.error("Submit failed:", res.status, msg);
        setStatus({ type: "error", msg });
      }
    } catch (err) {
      console.error("Network/JS error:", err);
      setStatus({ type: "error", msg: "Could not send. Check your connection and try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4" noValidate>
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

      {/* honeypot */}
      <div className="hidden">
        <label>
          Company
          <input type="text" autoComplete="organization" {...register("company")} />
        </label>
        <input type="hidden" {...register("submittedAt", { valueAsNumber: true })} />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" type="text" {...register("name")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" required />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" type="email" {...register("email")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" required />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone (optional)</label>
        <input id="phone" type="tel" {...register("phone")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message</label>
        <textarea id="message" rows={4} {...register("message")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" required />
        {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
