"use client";

import { request, FetcherOptions } from "./api-client";

export const clientApiClient = {
  get: <T>(endpoint: string, options?: Pick<FetcherOptions, "revalidate">) =>
    request<T>(endpoint, undefined, options),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, undefined, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, undefined, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, undefined, { method: "DELETE" }),
};