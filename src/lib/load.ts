import { ExpectedError, NotFoundError } from "@/constants/errors";

export type Loaded<T> = { data: T; error: string | null };

// The stable code the client keys into `errors.*`; anything unexpected is "unknown".
function code(error: unknown): string {
  return error instanceof ExpectedError ? error.code : "unknown";
}

// Non-critical read: the page still renders without the data. A falsy `promise`
// (`null`/`false`/`undefined`) is skipped and resolves to `fallback`.
async function soft<T>(promise: Promise<T> | null | false | undefined, fallback: T): Promise<Loaded<T>> {
  if (!promise) return { data: fallback, error: null };
  try {
    return { data: await promise, error: null };
  } catch (error) {
    console.error(error); // logged server-side; only the code reaches the client
    return { data: fallback, error: code(error) };
  }
}

// A missing record is `null`; every other failure still throws to the boundary.
async function optional<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

// First error code among several results, so one ErrorCard covers a batch.
function failure(results: { error: string | null }[]): string | null {
  return results.find((result) => result.error)?.error ?? null;
}

export const load = Object.assign(soft, { optional, code, failure });
