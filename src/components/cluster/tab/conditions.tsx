import { ClusterConditions } from "@/components/cluster/conditions";
import { Box } from "@/components/cluster/tab/frame";
import type { Condition } from "@/types/cluster";

export function ConditionsTab({ conditions }: { conditions: Condition[] }) {
  return (
    <Box>
      <ClusterConditions conditions={conditions} />
    </Box>
  );
}
