import { IMAGE_BASE_URL } from "./config";

export function resolveImageUrl(path: string): string {
  return new URL(path, IMAGE_BASE_URL).toString();
}
