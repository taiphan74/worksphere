"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, MailPlus, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { workspaceService } from "@/features/workspace/services/workspace-service";
import { useCreateWorkspace } from "@/features/workspace/hooks";
import { glassSurface } from "@/styles/glass";
import { cn } from "@/lib/utils";

type WorkspaceCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const steps = ["workspace", "invite"];

export function WorkspaceCreateDialog({ open, onOpenChange }: WorkspaceCreateDialogProps) {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const normalizedName = name.trim();
  const isSubmitting = createWorkspace.isPending;
  const canContinue = normalizedName.length > 0;
  const invalidEmail = useMemo(() => {
    const value = emailInput.trim();
    return value.length > 0 && !emailPattern.test(value);
  }, [emailInput]);

  const resetForm = () => {
    setCurrentStep(0);
    setName("");
    setEmailInput("");
    setEmails([]);
    setError(null);
  };

  const addEmail = (rawEmail: string) => {
    const value = rawEmail.trim().toLowerCase();

    if (!value) return true;

    if (!emailPattern.test(value)) {
      setError("Email không hợp lệ.");
      return false;
    }

    if (!emails.includes(value)) {
      setEmails((current) => [...current, value]);
    }

    setEmailInput("");
    setError(null);
    return true;
  };

  const removeEmail = (email: string) => {
    setEmails((current) => current.filter((item) => item !== email));
  };

  const handleEmailKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ","].includes(event.key)) {
      event.preventDefault();
      addEmail(emailInput);
    }

    if (event.key === "Backspace" && emailInput.length === 0 && emails.length > 0) {
      setEmails((current) => current.slice(0, -1));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!normalizedName) {
      setError("Vui lòng nhập tên workspace.");
      return;
    }

    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (!addEmail(emailInput)) return;

    try {
      const workspace = await createWorkspace.mutateAsync({ name: normalizedName });
      await Promise.allSettled(
        emails.map((email) => workspaceService.sendInvitation(workspace.id, { email })),
      );

      resetForm();
      onOpenChange(false);
      router.push(`/w/${workspace.slug}/home`);
    } catch {
      setError("Không thể tạo workspace. Vui lòng thử lại.");
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-white/10 backdrop-blur-sm"
        className={cn(
          "w-full max-w-lg border-0 p-0 shadow-none",
          glassSurface
        )}
      >
        <DialogTitle className="sr-only">Tạo workspace</DialogTitle>
        <DialogDescription className="sr-only">
          Tạo workspace mới và mời thành viên nếu cần.
        </DialogDescription>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "relative isolate overflow-hidden rounded-[26px] p-8 sm:p-10",
            // Nền glass đã được cung cấp bởi DialogContent, form chỉ cần layout
          )}
        >
          <div className="mb-10 flex items-center justify-between gap-2">
            {steps.map((_, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const canNavigate = index <= currentStep && !isSubmitting;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={!canNavigate}
                  onClick={() => canNavigate && setCurrentStep(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex h-8 flex-1 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                    canNavigate ? "cursor-pointer" : "cursor-not-allowed",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-primary/20 text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : index + 1}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6"
            >
              {currentStep === 0 ? (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900">Tạo workspace</h2>
                    <p className="mt-2 text-neutral-600">
                      Đặt tên cho không gian làm việc mới của bạn.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="workspace-name" className="text-sm font-medium text-neutral-800">
                      Tên workspace
                    </label>
                    <Input
                      id="workspace-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="VD: Product Team"
                      className="h-12 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground"
                      aria-invalid={!!error && !normalizedName}
                      autoFocus
                    />
                  </div>

                  {error ? <p className="text-sm text-destructive">{error}</p> : null}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      variant="glass"
                      className="h-12 w-full rounded-xl"
                      disabled={!canContinue}
                    >
                      Tiếp tục
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-10 w-full rounded-xl text-neutral-500"
                      onClick={() => handleOpenChange(false)}
                    >
                      Huỷ
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900">Mời thành viên</h2>
                    <p className="mt-2 text-neutral-600">
                      Thêm email thành viên, hoặc bỏ qua bước này.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="workspace-invites" className="text-sm font-medium text-neutral-800">
                      Email thành viên
                    </label>
                    <div
                      className={cn(
                        "min-h-12 rounded-xl border bg-background px-3 py-2 transition",
                        invalidEmail
                          ? "border-destructive ring-2 ring-destructive/15"
                          : "border-input focus-within:ring-3 focus-within:ring-ring/50",
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        {emails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => removeEmail(email)}
                              className="rounded-full p-0.5 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
                              aria-label={`Xoá ${email}`}
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          id="workspace-invites"
                          value={emailInput}
                          onChange={(event) => setEmailInput(event.target.value)}
                          onKeyDown={handleEmailKeyDown}
                          onBlur={() => addEmail(emailInput)}
                          placeholder={emails.length > 0 ? "Thêm email..." : "Nhập email rồi Enter"}
                          className="min-w-36 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                      <MailPlus className="size-3.5" />
                      Nhấn Enter hoặc dấu phẩy để thêm nhiều email.
                    </p>
                  </div>

                  {error ? <p className="text-sm text-destructive">{error}</p> : null}

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      variant="glass"
                      className="h-12 w-full rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                      {isSubmitting ? "Đang tạo..." : "Tạo workspace"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-10 w-full rounded-xl text-neutral-500"
                      disabled={isSubmitting}
                      onClick={() => setCurrentStep(0)}
                    >
                      Quay lại
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
