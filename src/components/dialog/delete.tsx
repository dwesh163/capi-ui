"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@/hooks/mutation";
import type { ServiceResponse } from "@/types/response";

// Generic: the caller supplies the name to retype, the action and where to go afterwards.
export function DeleteButton({
  name,
  redirectTo,
  onDelete,
  disabled,
}: {
  name: string;
  redirectTo: string;
  onDelete: () => Promise<ServiceResponse<unknown>>;
  disabled?: boolean;
}) {
  const translations = { dialog: useTranslations("dialog.delete") };
  const router = useRouter();
  const mutation = useMutation();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive" disabled={disabled}>
          <Trash2 />
          {translations.dialog("trigger")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.dialog("title", { name })}</AlertDialogTitle>
          <AlertDialogDescription>{translations.dialog("description", { name })}</AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          placeholder={name}
          aria-label={translations.dialog("confirmLabel", { name })}
          autoComplete="off"
          spellCheck={false}
          className="font-mono"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>{translations.dialog("cancel")}</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={typed !== name || mutation.isPending}
            onClick={() =>
              mutation.run(onDelete, {
                success: translations.dialog("success", { name }),
                onSuccess: () => {
                  setOpen(false);
                  router.push(redirectTo);
                  router.refresh();
                },
              })
            }
          >
            {translations.dialog("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
