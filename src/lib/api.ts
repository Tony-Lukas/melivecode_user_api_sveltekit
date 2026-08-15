import axios, {AxiosError} from "axios";
import { PUBLIC_BASE_URL } from '$env/static/public';
import type {
    User, 
    UserDetail, 
    PaginatedUsers, 
    CreateUserInput, 
    UpdateUserInput, 
    ApiMessageResponse
} from "./types";

const API_BASE = PUBLIC_BASE_URL;

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number){
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
/**
 * Convert Axios errors to custom ApiError. 
 */
function handleError(error: unknown): never {
    if(axios.isAxiosError(error)){
        const status = error.response?.status ?? 500;

        const message = 
            error.response?.data?.message ??
            error.message ??
            `Request Failed with status ${status}`;

        throw new ApiError(message, status);
    }
    throw error;
}
/**
* Axios instance
 */
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json"
    }
});

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
   try{
    const response = await api.get<User[] | PaginatedUsers>("",{params});
    return response.data;
   } catch (error){
    handleError(error);
   }
}

/** GET /api/users/{id} */
export async function getUser(id: number):Promise<UserDetail> {
    try{
        const response = await api.get<ApiMessageResponse<UserDetail>>(`/${id}`);
        if (!response.data.user) {
            throw new ApiError("User not found in response",500)
        }
        return response.data.user;
    }catch (error){
        handleError(error);
    }
}

/** POST /api/users */
export async function createUser(
    input: CreateUserInput
): Promise<UserDetail>{
    try{
        const response = await api.post<ApiMessageResponse<UserDetail>>("",input);
        if(!response.data.user){
            throw new ApiError("User not returned from create",500);
        }
        return response.data.user;
    } catch (error) {
        handleError(error);
    }
}

/** PUT /api/users/{id} */
export async function updateUser(id:number, input:UpdateUserInput): Promise<UserDetail>{
    
    try{
        const response = await api.put<ApiMessageResponse<UserDetail>>(`/${id}`,input);
        if(!response.data.user){
            throw new ApiError("User not returned from update",500);
        }
        return response.data.user;
    } catch (error) {
        handleError(error);
    }
}

/** DELETE /api/user/{id}*/
export async function deleteUser(id:number): Promise<void>{
    try{
        await api.delete<ApiMessageResponse<never>>(`/${id}`);
    }catch (error){
        handleError(error);
    }
}
