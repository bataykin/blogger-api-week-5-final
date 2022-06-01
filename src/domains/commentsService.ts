import {commentsRepo} from "../repos/commentsRepo";
import {postsService} from "./postsService";
import {bloggersService} from "./bloggersService";

export const commentsService = {

    async updateCommentById(commentId: string, content: string) {
        const updatedComment = await commentsRepo.updateCommentById(commentId, content)
        return updatedComment
    },

    async getCommentById(commentId: string) {
        const foundComment = await commentsRepo.getCommentById(commentId)
        if (!foundComment) {
            return false
        } else {
            return foundComment
        }
    },

    async deleteCommentById(id: string) {
        const isDeleted = await commentsRepo.deleteCommentById(id)
        if (isDeleted) {
            return true
        } else {
            return  false
        }
    },

    async getCommentsByPostId(postId: string, PageNumber: number, PageSize: number) {
        const pageNumber = Number(PageNumber) || 1;
        const pageSize = Number(PageSize) || 10;
        let skipSize = 0
        if (pageNumber > 1) {
            skipSize = pageSize * (pageNumber - 1)
        }
        const post = await postsService.findPostById(postId)
        if (!post) {
            return false
        } else {
            const paginatedComments = await commentsRepo.getCommentsByPostId(postId, PageNumber, PageSize,skipSize)
            const result = {
                "pagesCount": Math.ceil(Object.keys(paginatedComments).length / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": Object.keys(paginatedComments).length,
                "items": paginatedComments
            }
            return  result
        }
    },


    async createComment(postId: string, content: string) {
        const post = await postsService.findPostById(postId)
        const comment = {
            id: Math.random()*1000000  + "",
            title: "Title",
            shortDescription: "Short description",
            content: content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName,
            postId: postId
        }
        const newComment = await commentsRepo.createComment(comment)
        return newComment
    },


}