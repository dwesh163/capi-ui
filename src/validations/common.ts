import { z } from "zod";

export type CommonSchemaMessages = {
  required: string;
  invalidEmail: string;
  usernameFormat: string;
  usernameLength: string;
  passwordLength: string;
};

// Server-side default messages (English) — defense-in-depth; the client always
// validates first with translated messages from the factories.
export const defaultSchemaMessages: CommonSchemaMessages = {
  required: "Required",
  invalidEmail: "Invalid email",
  usernameFormat: "Letters, numbers, underscores and dots only",
  usernameLength: "Between 3 and 30 characters",
  passwordLength: "At least 8 characters",
};

export function requiredString(msgs: Pick<CommonSchemaMessages, "required">) {
  return z.string().min(1, msgs.required);
}
