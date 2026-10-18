import { cookies, headers } from "next/headers";
import { ACCESS_COOKIE, apiUrl } from "@/lib/auth-cookies";

/** Proxies a result file from Nest: <img> and <video> cannot send a Bearer token */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/files/[jobId]/[index]">,
) {
  const { jobId, index } = await params;
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return new Response("Authentication required", { status: 401 });

  const incoming = await headers();
  const upstream = await fetch(
    apiUrl(`/generation/jobs/${jobId}/files/${index}`),
    {
      headers: {
        authorization: `Bearer ${token}`,
        ...(incoming.get("range") ? { range: incoming.get("range")! } : {}),
      },
      cache: "no-store",
    },
  );

  if (!upstream.ok || !upstream.body) {
    return new Response("File not found", { status: upstream.status });
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": "private, max-age=3600",
      ...(upstream.headers.get("content-length")
        ? { "content-length": upstream.headers.get("content-length")! }
        : {}),
    },
  });
}
