export const baseUrl =
  typeof window === "undefined"
    ? process.env.API_BACKEND_URL
    : process.env.NEXT_PUBLIC_API_BACKEND_URL;
