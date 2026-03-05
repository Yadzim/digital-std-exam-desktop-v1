


export interface IBaseModel {
    id: number;
    created_at: number
    created_by: number
    updated_at: number | null
    updated_by: number | null
    status:number,
    order:number
}


export interface ICreatedBy {
    avatar: string | null
    email: string | null
    first_name: string
    id: number
    last_name: string
    role: Array<string>
    status: number
    username: string
}

export interface IUpdatedBy {
    avatar: string | null
    email: string | null
    first_name: string
    id: number
    last_name: string
    role: Array<string>
    status: number
    username: string
}


export interface IUserField {
    avatar: string
    email: string | null
    first_name: string
    id: number
    last_name: string
    role: Array<string>
    status: number
    username: string
}

