import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<unknown> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Return JSON for non-DELETE requests
  if (method !== "DELETE") {
    return res.json();
  }
  return res;
}

function buildUrl(queryKey: readonly unknown[]): string {
  const [baseUrl, ...rest] = queryKey;
  
  if (typeof baseUrl !== "string") {
    throw new Error("First element of queryKey must be a string URL");
  }
  
  // If there's a second element and it's an object, treat it as query params
  if (rest.length > 0 && typeof rest[0] === "object" && rest[0] !== null) {
    const params = rest[0] as Record<string, string | number | boolean | undefined>;
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
    
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
  
  // Otherwise join as path segments
  if (rest.length > 0) {
    return [baseUrl, ...rest].join("/");
  }
  
  return baseUrl;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = buildUrl(queryKey);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
