import {bloggersCollection, commentsCollection} from "./db";

export const commentsRepo = {

    async getCommentById(commentId: string) {
        const comment = await commentsCollection.findOne({id: commentId}, {projection: {_id:0}})
        if (!comment) {
            return false
        } else {
            return comment
        }
    },

    async updateCommentById(commentId: string, content: string) {
        return await commentsCollection.updateOne({id:commentId}, { $set: {content: content}})

    },

        async deleteCommentById(id: string) {
        const deletedComment = await commentsCollection.deleteOne({id: id})
        if (deletedComment.deletedCount > 0) {
            return true
        }
        return false
    },


    async getCommentsByPostId(postId: string, PageNumber: number, PageSize: number, skipSize: number) {
        const comment = await commentsCollection.find({postId: postId}).project({_id:0, postId: 0}).skip(skipSize).limit(PageSize).toArray()
        if (!comment) {
            return false
        } else {
            return comment
        }
    },

    async createComment(comment: {}) {
        const newComment = await commentsCollection.insertOne(comment)
        return await bloggersCollection.findOne({id: newComment.id}, {projection: {_id: 0, postId: 0}})
    },

}