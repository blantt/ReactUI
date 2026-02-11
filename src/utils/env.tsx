/** 是否為本機開發環境 */
export const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

/** API 基底路徑 */
export const API_BASE = isLocal
  ? "http://localhost:5170"
  : "http://localhost:5170"

/**
 * 組合 API URL
 * @example getApiUrl("/api/Handler_db.ashx?func=GetPersonMessage")
 */
export function getApiUrl(path: string): string {
  return `${API_BASE}${path}`;
}