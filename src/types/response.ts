import { ExpectedError } from "@/constants/errors";

export type ServiceResponse<T> = { data: T | null; error: string | null };

// For server actions called from client components: a thrown error loses its class crossing the
// boundary, so only the stable `.code` of an ExpectedError is returned, never a message.
export async function toResponse<T>(fn: () => Promise<T>, fallback: string): Promise<ServiceResponse<T>> {
  try {
    return { data: await fn(), error: null };
  } catch (error) {
    console.error(fallback, error);
    return { data: null, error: error instanceof ExpectedError ? error.code : "unknown" };
  }
}
