import { NextResponse, type NextRequest } from "next/server";
import { fetchGamesPage } from "@/lib/api/fetch-games";
import { parsePageParam } from "@/lib/page-param";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const page = parsePageParam(request.nextUrl.searchParams.get("page"));
  if (page === null) {
    return NextResponse.json({ error: "invalid_page" }, { status: 400 });
  }

  try {
    const data = await fetchGamesPage(page, { signal: request.signal });
    return NextResponse.json(data);
  } catch (error) {
    if (request.signal.aborted) {
      throw error;
    }
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }
}
