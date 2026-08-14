export interface User {
    id: number;
    fname: string;
    lname: string;
    username: string;
    avatar: string;
}

// shape returned by GET /api/users/{id} deail
export interface UserDetail extends User {
    email: string;
}

export interface PaginatedUsers {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
}

export interface CreateUserInput {
    fname: string;
    lname: string;
    username: string;
    password: string;
    email: string;
    avatar: string;
}

export interface UpdateUserInput {
    fname?: string;
    lname?: string;
    username?: string;
    password?: string;
    email?: string;
    avatar?: string;
}

export interface ApiMessageResponse<T>{
    status: 'ok' | 'error';
    message?: string;
    user?: T;
}