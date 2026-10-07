"use client";
import AppError from "@/app/error";
import { IDENTITIES } from "@/constants/resources";

export default function ClusterError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AppError error={error} reset={reset} fullScreen={false} entity={IDENTITIES.CLUSTERS} />;
}
