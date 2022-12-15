import { components, paths } from "./schema";

interface EmptyResponseData {
  message: string;
  statusCode: number;
}
interface ResponseData<D extends Record<string, any> | void>
  extends EmptyResponseData {
  data?: D;
}
interface APIFunctionOptions<O extends Record<string, any> | void> {
  onSuccess?(
    responseData: O extends void ? EmptyResponseData : ResponseData<O>
  ): void;
  onError?(responseData: EmptyResponseData & { error: string }): void;
  accessToken?: string;
}
interface PaginationData {
  page: number;
  limit: number;
  totalRecord: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

type Schemas = components["schemas"];

const baseUrl = "https://dev-panoton.spellbrand.io";
const buildUrl = (path: keyof paths) => {
  return `${baseUrl}${path}`;
};
const createAPIFunction = <
  I extends Record<string, any> | void = void,
  O extends Record<string, any> | void = void,
  Q extends Record<string, string> | void = void
>(
  method: "POST" | "GET" | "PUT" | "DELETE",

  path: keyof paths
) => {
  return async (
    input: (I extends void ? {} : I) & (Q extends void ? {} : { query: Q }),
    options?: APIFunctionOptions<O> | null
  ): Promise<O extends void ? EmptyResponseData : ResponseData<O>> => {
    const { query, ...body } = (input || {}) as any;
    const paramsString = new URLSearchParams(
      (query || {}) as Record<string, string>
    ).toString();
    const stringifiedBody = JSON.stringify(body);
    try {
      
      const response = await fetch(`${buildUrl(path)}?${paramsString}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(options && options.accessToken
            ? { Authorization: `Bearer ${options.accessToken}` }
            : {}),
        },
        credentials: "include",
        method,
        ...(stringifiedBody === "{}"
          ? {}
          : {
              body: stringifiedBody,
            }),
      });
      const result = await response.json();
      if (response.ok) {
        options?.onSuccess?.(result);
      } else {
        options?.onError?.(result);
      }

      return result;
    } catch (error) {
      return { message: "", statusCode: 400 } as O extends void
        ? EmptyResponseData
        : ResponseData<O>;
    }
  };
};

export { createAPIFunction };
export type { APIFunctionOptions, PaginationData, Schemas };
