"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { consultationSchema, type ConsultationSchema } from "@/lib/validation/consultationSchema";
import { FormField, inputClass } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { SOCIALS, SUPABASE_ANON_KEY, CONSULTATION_FUNCTION_URL } from "@/lib/constants";

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationSchema>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { locale },
  });

  const validationMessage = (key?: string) => {
    if (!key) return undefined;
    return (t.form.validation as Record<string, string>)[key] ?? key;
  };

  const onSubmit = async (data: ConsultationSchema) => {
    setStatus("submitting");
    try {
      const res = await fetch(CONSULTATION_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ ...data, locale }),
      });

      if (!res.ok) throw new Error("request_failed");

      setStatus("success");
      reset({ locale });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          ✓
        </div>
        <h3 className="font-display text-xl mb-2">{t.form.successTitle}</h3>
        <p className="text-muted">{t.form.successBody}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t.form.nameLabel} htmlFor="name" error={validationMessage(errors.name?.message)}>
          <input id="name" className={inputClass} placeholder={t.form.namePlaceholder} {...register("name")} />
        </FormField>

        <FormField label={t.form.contactLabel} htmlFor="contact" error={validationMessage(errors.contact?.message)}>
          <input id="contact" className={inputClass} placeholder={t.form.contactPlaceholder} {...register("contact")} />
        </FormField>
      </div>

      <FormField label={t.form.companyLabel} htmlFor="company">
        <input id="company" className={inputClass} placeholder={t.form.companyPlaceholder} {...register("company")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t.form.needLabel} htmlFor="need" error={validationMessage(errors.need?.message)}>
          <select id="need" className={inputClass} defaultValue="" {...register("need")}>
            <option value="" disabled>
              —
            </option>
            {t.form.needOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t.form.budgetLabel} htmlFor="budget" error={validationMessage(errors.budget?.message)}>
          <select id="budget" className={inputClass} defaultValue="" {...register("budget")}>
            <option value="" disabled>
              —
            </option>
            {t.form.budgetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label={t.form.messageLabel} htmlFor="message" error={validationMessage(errors.message?.message)}>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          placeholder={t.form.messagePlaceholder}
          {...register("message")}
        />
      </FormField>

      <input type="hidden" value={locale} {...register("locale")} />

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm"
          >
            <p className="font-medium text-error">{t.form.errorTitle}</p>
            <p className="mt-1 text-muted">{t.form.errorBody}</p>
            <a
              href={SOCIALS.telegram}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-accent hover:underline"
            >
              {t.form.errorFallbackCta} →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? t.form.submitting : t.form.submit}
      </Button>
    </form>
  );
}
