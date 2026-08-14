import type {User, UserDetail, PaginatedUsers, CreateUserInput, UpdateUserInput, ApiMessageResponse} from "./types";

const API_BASE = "https://melivecode.com/api/users";

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number){
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

async function handleResponse<T>(res: Response): Promise<T> {
    let body: unknown = null;
    try{
        body = await res.json();
    }catch{
        // no JSON body
    }
    if(!res.ok){
        const message = 
        (body && typeof body === 'object' && 'message' in body ?
            (body as {message?: string}).message : undefined) 
        ?? `Request failed with status ${res.status}`;
        throw new ApiError(message, res.status);   
    }
    return body as T;
}

export interface ListUsersParams {
    search?: string;
    page?: number;
    per_page?: number;
    sort_columns?: string;
    sort_order?: 'asc' | 'desc';
}

// GET /api/users - supports search, pagination and sorting 
export async function listUsers(
    params: ListUsersParams = {}
): Promise<User[] | PaginatedUsers>{
   const query = new URLSearchParams();
   if(params.search) query.set('search', params.search);
   if(params.page) query.set('page', String(params.page));
   if(params.per_page) query.set('per_page', String(params.per_page));
   if(params.sort_columns) query.set('sort_columns', params.sort_columns);
   if(params.sort_order) query.set('sort_order', params.sort_order);
   
   const qs = query.toString();
   console.log(qs)
   const res = await fetch(`${API_BASE}${qs ? `?${qs}`:''}`,
        {headers: {'Content-Type':'application/json'} 
    });

    return handleResponse<User[] | PaginatedUsers>(res);
}

/** GET /api/users/{id} */
export async function getUser(id: number):Promise<UserDetail> {
    const res = await fetch(`${API_BASE}/${id}`,{
        headers: {'Content-Type':'application/json'}
    });
    const body =  await handleResponse<ApiMessageResponse<UserDetail>>(res);
    if(!body.user) throw new ApiError("User not found in response",500);
    return  body.user;
}

/** POST /api/users */
export async function createUser(input: CreateUserInput): Promise<UserDetail>{
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(input)
    });
    const body = await handleResponse<ApiMessageResponse<UserDetail>>(res);
    if(!body.user) throw new ApiError('User not return from create',500);
    return body.user;
}

/** PUT /api/users/{id} */
export async function updateUser(id:number, input:UpdateUserInput): Promise<UserDetail>{
    const res = await fetch(`${API_BASE}/${id}`,{
        method: "PUT",
        headers: {"Content-Type":'application/json'},
        body: JSON.stringify(input)
    });
    const body = await handleResponse<ApiMessageResponse<UserDetail>>(res);
    if(!body.user) throw new ApiError('User not return from update',500);
    return body.user;
}

/** DELETE /api/user/{id}*/
export async function deleteUser(id:number): Promise<void>{
    const res = await fetch(`${API_BASE}/${id}`,{
        method: "DELETE",
        headers: {"Content-Type":'application/json'}
    });
    await handleResponse<ApiMessageResponse<never>>(res);
}
