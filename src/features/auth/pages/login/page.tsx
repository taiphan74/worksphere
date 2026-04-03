import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthPage } from "@/features/auth/components/auth-page";

export default async function LoginFeaturePage() {
  const t = await getTranslations("auth");

  return (
    <AuthPage title={t("login")}>
      <LoginForm />
    </AuthPage>
  );
}
