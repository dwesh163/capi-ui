import { NextResponse } from "next/server";
import { ExpectedError, NotFoundError, UnauthorizedError } from "@/constants/errors";
import { clusters } from "@/services/clusters";

const STATUS = (error: unknown) => {
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof NotFoundError) return 404;
  return error instanceof ExpectedError ? 400 : 500;
};

// A file download with Content-Disposition: a server action can't set response headers.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  try {
    const kubeconfig = await clusters.kubeconfig(name);
    return new NextResponse(kubeconfig, {
      headers: {
        "Content-Type": "application/yaml",
        "Content-Disposition": `attachment; filename="${name}.kubeconfig.yaml"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to read kubeconfig", error);
    return new NextResponse(error instanceof ExpectedError ? error.code : "unknown", { status: STATUS(error) });
  }
}
