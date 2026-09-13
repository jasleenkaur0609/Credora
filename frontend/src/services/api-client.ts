const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  accessToken?: string | null;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  const text = await response.text();

  return text as T;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    body,
    accessToken,
    headers: customHeaders,
    ...requestInit
  } = options;

  const headers = new Headers(customHeaders);

  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestInit,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const result = await parseResponse<
    ApiResponse<T> | Record<string, unknown> | string
  >(response);

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";

    if (
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
    ) {
      message = result.message;
    } else if (typeof result === "string" && result.trim()) {
      message = result;
    }

    throw new ApiError(message, response.status, result);
  }

  return result as T;
}

export const apiClient = {
  get<T>(
    endpoint: string,
    options: Omit<RequestOptions, "body" | "method"> = {},
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, "body" | "method"> = {},
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, "body" | "method"> = {},
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    options: Omit<RequestOptions, "body" | "method"> = {},
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, "body" | "method"> = {},
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};

export { API_BASE_URL };