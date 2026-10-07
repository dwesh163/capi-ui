import { z } from "zod";
import { type CommonSchemaMessages, defaultSchemaMessages, requiredString } from "./common";

export function buildSignInSchema(msgs: CommonSchemaMessages) {
  return z.object({
    username: requiredString(msgs),
    password: requiredString(msgs),
  });
}

export function buildSignUpSchema(msgs: CommonSchemaMessages) {
  return z.object({
    name: requiredString(msgs),
    email: z.email(msgs.invalidEmail),
    username: z
      .string()
      .min(3, msgs.usernameLength)
      .max(30, msgs.usernameLength)
      .regex(/^[a-zA-Z0-9_.]+$/, msgs.usernameFormat),
    password: z.string().min(8, msgs.passwordLength),
  });
}

// Non-localized instances for server-side/defense-in-depth use.
export const signInSchema = buildSignInSchema(defaultSchemaMessages);
export const signUpSchema = buildSignUpSchema(defaultSchemaMessages);
export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
