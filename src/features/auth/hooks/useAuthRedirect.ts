import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUser } from "@/features/auth/hooks/useGetCurrentUser";

/**
 * Hook để kiểm tra xác thực và redirect nếu cần
 * Dùng trong client components để đảm bảo người dùng đã xác thực
 */
export function useAuthRedirect() {
  const router = useRouter();
  const { data: currentUser, isLoading } = useGetCurrentUser();

  useEffect(() => {
    // Trong khi đang tải, không làm gì
    if (isLoading) return;

    // Nếu không có người dùng và không đang ở trang login/register
    // thì redirect về trang login
    if (!currentUser) {
      // Chỉ redirect nếu không phải đang ở trang auth
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && !path.includes('/auth')) {
        router.push('/login');
      }
    }
  }, [currentUser, isLoading, router]);
}