"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { consultationSchema, type ConsultationSchema } from "@/lib/validation/consultationSchema";
import { FormField, inputClass } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { SOCIALS, SUPABASE_ANON_KEY, CONSULTATION_FUNCTION_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ConsultationSchema>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { locale, interests: [] },
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
      reset({ locale, interests: [] });
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
        <FormField
          label={t.form.firstNameLabel}
          htmlFor="firstName"
          error={validationMessage(errors.firstName?.message)}
        >
          <input
            id="firstName"
            className={inputClass}
            placeholder={t.form.firstNamePlaceholder}
            {...register("firstName")}
          />
        </FormField>

        <FormField
          label={t.form.lastNameLabel}
          htmlFor="lastName"
          error={validationMessage(errors.lastName?.message)}
        >
          <input
            id="lastName"
            className={inputClass}
            placeholder={t.form.lastNamePlaceholder}
            {...register("lastName")}
          />
        </FormField>
      </div>

      <FormField label={t.form.emailLabel} htmlFor="email" error={validationMessage(errors.email?.message)}>
        <input
          id="email"
          type="email"
          className={inputClass}
          placeholder={t.form.emailPlaceholder}
          {...register("email")}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label={t.form.companyNameLabel}
          htmlFor="companyName"
          error={validationMessage(errors.companyName?.message)}
        >
          <input
            id="companyName"
            className={inputClass}
            placeholder={t.form.companyNamePlaceholder}
            {...register("companyName")}
          />
        </FormField>

        <FormField
          label={t.form.companyWebsiteLabel}
          htmlFor="companyWebsite"
          error={validationMessage(errors.companyWebsite?.message)}
        >
          <input
            id="companyWebsite"
            className={inputClass}
            placeholder={t.form.companyWebsitePlaceholder}
            {...register("companyWebsite")}
          />
        </FormField>
      </div>

      <FormField label={t.form.roleLabel} htmlFor="role" error={validationMessage(errors.role?.message)}>
        <select id="role" className={inputClass} defaultValue="" {...register("role")}>
          <option value="" disabled>
            {t.form.selectPlaceholder}
          </option>
          {t.form.roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label={t.form.companySizeLabel}
          htmlFor="companySize"
          error={validationMessage(errors.companySize?.message)}
        >
          <select id="companySize" className={inputClass} defaultValue="" {...register("companySize")}>
            <option value="" disabled>
              {t.form.selectPlaceholder}
            </option>
            {t.form.companySizeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label={t.form.annualRevenueLabel}
          htmlFor="annualRevenue"
          error={validationMessage(errors.annualRevenue?.message)}
        >
          <select id="annualRevenue" className={inputClass} defaultValue="" {...register("annualRevenue")}>
            <option value="" disabled>
              {t.form.selectPlaceholder}
            </option>
            {t.form.annualRevenueOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        label={t.form.projectBudgetLabel}
        htmlFor="projectBudget"
        error={validationMessage(errors.projectBudget?.message)}
      >
        <select id="projectBudget" className={inputClass} defaultValue="" {...register("projectBudget")}>
          <option value="" disabled>
            {t.form.selectPlaceholder}
          </option>
          {t.form.projectBudgetOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label={t.form.howCanWeHelpLabel}
        htmlFor="howCanWeHelp"
        error={validationMessage(errors.howCanWeHelp?.message)}
      >
        <textarea
          id="howCanWeHelp"
          rows={3}
          className={inputClass}
          placeholder={t.form.howCanWeHelpPlaceholder}
          {...register("howCanWeHelp")}
        />
      </FormField>

      <div>
        <label className="mb-2 block text-sm text-muted">{t.form.interestsLabel}</label>
        <Controller
          name="interests"
          control={control}
          render={({ field }) => (
            <div className="grid gap-3 sm:grid-cols-2">
              {t.form.interestsOptions.map((opt) => {
                const checked = field.value?.includes(opt.value) ?? false;
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors",
                      checked ? "border-accent bg-accent-soft" : "border-surface-border hover:border-accent/40"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-surface-border accent-[var(--accent)]"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...(field.value ?? []), opt.value]
                          : (field.value ?? []).filter((v) => v !== opt.value);
                        field.onChange(next);
                      }}
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.interests?.message && (
          <p className="mt-1.5 text-xs text-error">{validationMessage(errors.interests.message)}</p>
        )}
      </div>

      <FormField label={t.form.additionalInfoLabel} htmlFor="additionalInfo">
        <textarea
          id="additionalInfo"
          rows={3}
          className={inputClass}
          placeholder={t.form.additionalInfoPlaceholder}
          {...register("additionalInfo")}
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

      <Button type="submit" disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? t.form.submitting : t.form.submit}
      </Button>
    </form>
  );
}
