import { getSession } from "next-auth/react";

const isServer = typeof window === "undefined";
const defaultLocalUrl = isServer ? "http://127.0.0.1:8000/api" : "/api/backend";
const apiBase = isServer ? (process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000/api") : (process.env.NEXT_PUBLIC_API_URL ?? defaultLocalUrl);

export async function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Not authenticated.");
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(payload.message ?? "Request failed.");
  }

  return (await response.json()) as T;
}
