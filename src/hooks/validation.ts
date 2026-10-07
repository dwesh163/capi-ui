"use client";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { CommonSchemaMessages } from "@/validations/common";

export function useValidationMessages(): CommonSchemaMessages {
  const translations = useTranslations("common.validation");
  return useMemo(
    () => ({
      required: translations("required"),
      invalidEmail: translations("invalidEmail"),
      usernameFormat: translations("usernameFormat"),
      usernameLength: translations("usernameLength"),
      passwordLength: translations("passwordLength"),
    }),
    [translations],
  );
}
