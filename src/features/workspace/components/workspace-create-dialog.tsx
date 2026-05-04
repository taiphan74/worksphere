"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { Check, Loader2, MailPlus, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { glassEffect } from "@/styles/glass";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useCreateWorkspace } from "../hooks";
import { workspaceService } from "../services/workspace-service";

type WorkspaceCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WorkspaceCreateDialog({ open, onOpenChange }: WorkspaceCreateDialogProps) {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inviteWarning, setInviteWarning] = useState<string | null>(null);

  const normalizedName = name.trim();
  const canProceedToStep2 = normalizedName.length > 0;
  const canSubmit = normalizedName.length > 0 && !createWorkspace.isPending;

  const invalidEmail = useMemo(() => {
    const value = emailInput.trim();
    return value.length > 0 && !emailPattern.test(value);
  }, [emailInput]);

  const resetForm = () => {
    setName("");
    setEmailInput("");
    setEmails([]);
    setError(null);
    setInviteWarning(null);
    setCurrentStep(1);
  };

  const addEmail = (rawEmail: string) => {
    const value = rawEmail.trim().toLowerCase();

    if (!value) return;

    if (!emailPattern.test(value)) {
      setError("Email không hợp lệ.");
      return;
    }

    if (emails.includes(value)) {
      setEmailInput("");
      setError(null);
      return;
    }

    setEmails((current) => [...current, value]);
    setEmailInput("");
    setError(null);
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

  const handleNextStep = () => {
    if (!normalizedName) {
      setError("Vui lòng nhập tên workspace.");
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInviteWarning(null);

    if (!normalizedName) {
      setError("Vui lòng nhập tên workspace.");
      return;
    }

    if (emailInput.trim()) {
      if (!emailPattern.test(emailInput.trim())) {
        setError("Email không hợp lệ.");
        return;
      }

      addEmail(emailInput);
      return;
    }

    try {
      const workspace = await createWorkspace.mutateAsync({ name: normalizedName });

      if (emails.length > 0) {
        const failedInvites = await Promise.allSettled(
          emails.map((email) => workspaceService.sendInvitation(workspace.id, { email })),
        );
        const failedCount = failedInvites.filter((result) => result.status === "rejected").length;
        if (failedCount > 0) {
          setInviteWarning(`Workspace đã tạo, nhưng ${failedCount} lời mời gửi thất bại.`);
        }
      }

      resetForm();
      onOpenChange(false);
      router.push(`/w/${workspace.slug}/home`);
    } catch {
      setError("Không thể tạo workspace. Vui lòng thử lại.");
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (createWorkspace.isPending) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="overflow-hidden border-0 p-0 outline-none"
        aria-describedby="workspace-create-description"
      >
        <DialogTitle className="sr-only">Tạo workspace mới</DialogTitle>
        <DialogDescription id="workspace-create-description" className="sr-only">
          Đặt tên workspace và mời thành viên qua email.
        </DialogDescription>

        <motion.form
          onSubmit={handleSubmit}
          className={cn(
            "relative isolate overflow-hidden rounded-[26px] border border-white/30 bg-white/14 p-8 shadow-[0_28px_72px_rgba(82,99,132,0.24),0_8px_24px_rgba(255,255,255,0.28),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(82,99,132,0.08)] backdrop-blur-xl sm:p-10",
            glassEffect,
          )}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
        >
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -inset-1 opacity-30" aria-hidden="true">
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 blur-3xl" />
          </div>

          <div className="relative space-y-6">
            <div className="space-y-3 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  Tạo workspace mới
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {currentStep === 1
                    ? "Đặt tên không gian làm việc của bạn."
                    : "Thêm thành viên bằng email (không bắt buộc)."}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label htmlFor="workspace-name" className="text-sm font-medium text-slate-800">
                      Tên workspace <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="workspace-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Product Team"
                      className="h-11 border-slate-200/80 bg-white/80 text-slate-950 shadow-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && normalizedName) {
                          e.preventDefault();
                          handleNextStep();
                        }
                      }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label htmlFor="workspace-invites" className="text-sm font-medium text-slate-800">
                      Mời thành viên
                    </label>
                    <div
                      className={cn(
                        "min-h-11 rounded-xl border bg-white/80 px-3 py-2 shadow-sm transition",
                        invalidEmail
                          ? "border-red-300 ring-2 ring-red-100"
                          : "border-slate-200/80 focus-within:ring-2 focus-within:ring-slate-900/10",
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        {emails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-950 px-2.5 py-1 text-xs font-medium text-white"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => removeEmail(email)}
                              className="rounded-full p-0.5 text-white/70 transition hover:bg-white/15 hover:text-white"
                              aria-label={`Xoá ${email}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          id="workspace-invites"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          onKeyDown={handleEmailKeyDown}
                          onBlur={() => addEmail(emailInput)}
                          placeholder={emails.length > 0 ? "Thêm email..." : "Nhập email rồi Enter"}
                          className="min-w-40 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MailPlus className="h-3.5 w-3.5" />
                      Nhấn Enter hoặc dấu phẩy để thêm nhiều email.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(error || inviteWarning) && (
              <div
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm",
                  error
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-amber-200 bg-amber-50 text-amber-700",
                )}
              >
                {error || inviteWarning}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-slate-200/70 pt-5">
              {currentStep === 2 ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackStep}
                    disabled={createWorkspace.isPending}
                    className="text-slate-600 hover:text-slate-950"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="min-w-36 gap-2 bg-slate-950 text-white hover:bg-slate-800"
                  >
                    {createWorkspace.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Tạo workspace
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenChange(false)}
                    className="text-slate-600 hover:text-slate-950"
                  >
                    Huỷ
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!canProceedToStep2}
                    className="bg-slate-950 text-white hover:bg-slate-800"
                  >
                    Tiếp tục
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
