import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";

/**
 * React Query hook để lấy thông tin người dùng hiện tại
 * Dùng cho client components để quản lý trạng thái xác thực
 */
export function useGetCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const user = await authService.getMe();
        return user;
      } catch (error) {
        // Nếu không lấy được thông tin người dùng, trả về null
        // Điều này sẽ khiến component biết rằng người dùng chưa xác thực
        return null;
      }
    },
    // Không cache lâu dài để luôn cập nhật thông tin mới nhất
    staleTime: 0,
    // Không retry để tránh làm chậm ứng dụng khi không có mạng
    retry: false,
  });
}