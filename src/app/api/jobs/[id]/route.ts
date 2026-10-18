import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { getJob } from "@/lib/generation";

/** Client-side status polling: the browser calls this, the token stays on the server */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/jobs/[id]">,
) {
  const { id } = await params;
  try {
    return NextResponse.json(await getJob(id));
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: "Could not load the job status" },
      { status },
    );
  }
}
