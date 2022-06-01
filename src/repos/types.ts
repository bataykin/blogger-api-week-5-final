import {ObjectId, WithId} from 'mongodb'

export type BloggerDBType = WithId<{
    id: number
    name: string
    youtubeUrl: string
}>
export type PostDBType = WithId<{
    id: number
    title: string
    shortDescription: string
    content: string
    bloggerId: number
    bloggerName: string
}>


export type UserDBType = {
    id: string
    login: string
    passwordHash: string
    createdAt: Date
}

export type FeedbackDBType = WithId<{
    adminId: ObjectId
    adminName: string
    comment: string
    createdAt: Date
}>
