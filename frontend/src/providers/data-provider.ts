import type { DataProvider } from "@refinedev/core";

const API_URL = import.meta.env.VITE_API_URL;

type ApiResponse<T> = {
   success: boolean;
   message?: string;
   data: T;
   error?: string
}

async function request<T>(
    url: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        }
    })


const body = (await response.json()) as ApiResponse<T>

if(!response.ok || !body.success){
    throw new Error(body.error ?? body.message ?? "API request failed");
}
return body.data
}

const dataProvider : DataProvider = {
    getApiUrl: () => API_URL,

    async getList({resource}) {
        const data = await request<Record<string, unknown>[]>(
            `${API_URL}/${resource}`
        )

        return {
            data,
            total: data.length
        }
    },

    async getOne({resource, id}) {
        const data = await request<Record<string, unknown>>(
            `${API_URL}/${resource}/${id}`
        )

        return {data}
    },
    async create({resource, variables}) {
        const result = await request<Record<string, unknown>[]>(
            `${API_URL}/${resource}`,{
                method: "POST",
                body: JSON.stringify(variables),
            }
        )
        return {data: result[0]}
    }
}

export default dataProvider