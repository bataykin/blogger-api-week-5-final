import {bloggersRepo} from "../repos/bloggersRepo";
import {postsRepo} from "../repos/postsRepo";
import {postsCollection} from "../repos/db";
import {bloggersService} from "./bloggersService";

export const postsService = {

    async getAll(PageNumber: Nullable<number>, PageSize: Nullable<number>, bloggerId?: string) {
        const pageNumber = Number(PageNumber) || 1;
        const pageSize = Number(PageSize) || 10;
        let skipSize = 0
        if (pageNumber > 1) {
            skipSize = pageSize * (pageNumber - 1)
        }
        const postsPaginated = await postsRepo.getPosts(pageNumber, pageSize, skipSize, bloggerId)
        const result = {
            "pagesCount": Math.ceil(Object.keys(postsPaginated).length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": Object.keys(postsPaginated).length,
            "items": postsPaginated
        }
        return  result
    },

    async createPost(title: Nullable<string>, shortDescription: Nullable<string>, content: Nullable<string>, bloggerId: string) {
        const blogger = await bloggersService.getBloggerById(bloggerId)
        const newPost = {
            id: Math.random()*1000000  + "",
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: blogger.name
        }
        const post = await postsRepo.createPost(newPost)
       return post
    },

    async findPostById(id: string) {
        const foundPost = await postsRepo.findPostById(id)
        return foundPost
    },

    async updatePostById(postId: string, newTitle: string, newShortDescription: string, newContent: string, newBloggerId: number) {
        const isFound = await postsRepo.findPostById(postId)
        if (!isFound) {
            return false
        } else {
            const updatedPost = await postsRepo.updatePostById(postId, newTitle, newShortDescription, newContent, newBloggerId)
            return updatedPost
        }
    },

    async deletePostById(postId: string) {
        const isDeleted = await postsRepo.deletePostById(postId)
        return isDeleted

    }

}