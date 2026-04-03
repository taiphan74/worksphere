import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthPage } from "@/features/auth/components/auth-page";

export default async function RegisterFeaturePage() {
  const t = await getTranslations("auth");

  return (
    <AuthPage title={t("register")}>
      <RegisterForm />
    </AuthPage>
  );
}
