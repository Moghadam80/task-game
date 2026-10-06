import { fetchGamesPage } from "@/lib/api/fetch-games";
import { GameGrid } from "./GameGrid";

export async function GamesSection() {
  const firstPage = await fetchGamesPage(1);
  return <GameGrid initialPage={firstPage} />;
}
