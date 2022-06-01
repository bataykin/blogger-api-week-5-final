export type Nullable<T> = T | null | undefined;

type commentType = {
    id: Nullable<string>,
    content: Nullable<string>,
    userId: Nullable<string>,
    userLogin: Nullable<string>,
    addedAt: Date
}


import {AdminDBType} from '../repositories/types'

declare global {
    declare namespace Express {
        export interface Request {
            admin: AdminDBType | null
        }
    }
}


// {
//     id:	string
//     nullable: true
//     content	string
//     nullable: true
//     userId	string
//     nullable: true
//     userLogin	string
//     nullable: true
//     addedAt	string($date-time)
// }