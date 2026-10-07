"use server";

import { revalidatePath } from "next/cache";
import { clusters } from "@/services/clusters";
import { toResponse } from "@/types/response";

export async function scaleCluster(name: string, replicas: number) {
  return toResponse(async () => {
    await clusters.scale(name, replicas);
    revalidatePath(`/clusters/${name}`);
  }, "Failed to scale cluster");
}

export async function removeCluster(name: string) {
  return toResponse(async () => {
    await clusters.remove(name);
    revalidatePath("/clusters");
  }, "Failed to delete cluster");
}
