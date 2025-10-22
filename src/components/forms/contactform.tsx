import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please include a short message"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  async function onSubmit(data: FormData) {
    try {
      // DEV fallback: Vite dev server doesn't host /api/*.
      if (import.meta.env.DEV) {
        console.log("💡 DEV mode – not calling server. Payload:", data);
        await new Promise((r) => setTimeout(r, 400)); // tiny delay for UX
        reset();
        navigate("/thank-you");
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        navigate("/thank-you");
      } else {
        const err = await res.text();
        alert(err || "Something went wrong, please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not send. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" type="text" {...register("name")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" type="email" {...register("email")}
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" />
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
          className="mt-1 w-full rounded-lg border border-neutral-300 p-2 focus:border-steel focus:ring-steel" />
        {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
