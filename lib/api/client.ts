import axios from "axios";
import { REQUEST_TIMEOUT_MS } from "../config";
import type { GamesPage } from "../game";
import { parseGamesPage } from "./parse-page";

const proxy = axios.create({ baseURL: "/api", timeout: REQUEST_TIMEOUT_MS });

export async function fetchGamesPageFromProxy(
  page: number,
  signal?: AbortSignal,
): Promise<GamesPage> {
  const response = await proxy.get<unknown>("/games", { params: { page }, signal });
  return parseGamesPage(response.data);
}
