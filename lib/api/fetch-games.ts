import axios, { isAxiosError, isCancel } from "axios";
import { GAMES_API_URL, PAGE_PARAM, REQUEST_TIMEOUT_MS } from "../config";
import type { GamesPage } from "../game";
import { ApiError } from "./errors";
import { parseGamesResponse } from "./parse";

export type FetchGamesOptions = {
  readonly signal?: AbortSignal;
};

const client = axios.create({ timeout: REQUEST_TIMEOUT_MS });

export async function fetchGamesPage(
  page: number,
  options: FetchGamesOptions = {},
): Promise<GamesPage> {
  try {
    const response = await client.get<unknown>(GAMES_API_URL, {
      params: { [PAGE_PARAM]: page },
      signal: options.signal,
    });
    return parseGamesResponse(response.data);
  } catch (error) {
    if (isCancel(error)) throw error;
    if (isAxiosError(error)) {
      throw new ApiError(
        error.response ? `Upstream responded with ${error.response.status}` : error.message,
      );
    }
    throw error;
  }
}
