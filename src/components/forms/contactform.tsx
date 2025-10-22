import React, { useRef } from "react";
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
  // anti-spam fields
  company: z.string().max(0).optional(), // honeypot: must be blank
  submittedAt: z.number().optional(),    // simple timing check
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const navigate = useNavigate();
  const mountedAtRef = useRef<number>(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  async function onSubmit(data: FormData) {
    try {
      // attach timing
      setValue("submittedAt", Date.now());

      if (import.meta.env.DEV) {
        console.log("💡 DEV mode — payload:", { ...data, mountedAt: mountedAtRef.current });
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
        track?.("generate_lead", { form: "contact" });
        navigate("/thank-you");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Something went wrong, please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not send. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4" noValidate>
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
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel"
          required
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
          required
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
          required
        />
        {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      <p className="sr-only" aria-live="polite">
        {isSubmitting ? "Sending" : "Idle"}
      </p>
    </form>
  );
}
