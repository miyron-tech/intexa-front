import { cookies } from "next/headers";
import { ACCESS_COOKIE, apiUrl } from "@/lib/auth-cookies";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string; index: string }> },
) {
  const { jobId, index } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(jobId) || !/^\d+$/.test(index))
    return new Response("Invalid file", { status: 400 });
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return new Response("Authentication required", { status: 401 });
  // Nest checks the live administrator role for every file request.
  const upstream = await fetch(
    apiUrl(`/admin/generations/${jobId}/files/${index}`),
    { headers: { authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!upstream.ok || !upstream.body)
    return new Response("File unavailable", { status: upstream.status });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": "private, no-store",
    },
  });
}
