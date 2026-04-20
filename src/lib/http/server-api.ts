import axios from "axios";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createServerApiClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
}
