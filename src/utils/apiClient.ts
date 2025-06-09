import { UsersResponse } from "./types"

export async function getUsers({ page, limit, search }: { page: number; limit: number; search: string }): Promise<UsersResponse> {
    const skip = (page - 1) * limit
    const url = `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch users") // we have to use this error handler while we using standart "fetch"
    return res.json()
}
