import {bloggersCollection, postsCollection} from "./db";
import {bloggersRepo} from "./bloggersRepo";
import {ObjectId} from "mongodb";
import {postsRouter} from "../routes/postsRouter";

export const postsRepo = {
    async getPosts(pageNumber: number , pageSize: number, skipSize: number, bloggerId?: string) {
        let allPosts = {}
        if (bloggerId) {
            allPosts = await postsCollection.find({bloggerId: bloggerId}).project({_id: 0}).skip(skipSize).limit(pageSize).toArray()
        }else {
           allPosts = await postsCollection.find({}).project({ _id: 0}).skip(skipSize).limit(pageSize).toArray()
        }
        return allPosts
    },

    async createPost(newPost: {}) {
        const createdPost = await postsCollection.insertOne(newPost)
        return await postsCollection.findOne({"_id": createdPost.insertedId}, {projection: {_id: 0}})
    },

    async getPostsFromBlogger(bloggerId: number , PageNumber: number | null | undefined, PageSize: number | null | undefined) {
        let skipSize = 0
        if ((!PageNumber) || (typeof PageNumber !== "number")) {
            PageNumber = 1
        }
        if ((!PageSize) || (typeof PageSize !== "number")) {
            PageSize = 10
        }
        // if ((typeof PageSize === "number") && (typeof PageNumber === "number") && (PageNumber > 0)) {
        if (PageNumber > 1) {
            skipSize = PageSize * (PageNumber - 1)
        }
        // }
            return {
                "pagesCount": Math.ceil(await postsCollection.find({bloggerId: bloggerId}).count()/Number(PageSize)),
                "page": PageNumber,
                "pageSize": PageSize,
                "totalCount": await postsCollection.find({bloggerId: bloggerId}).count(),
                "items":
                    await postsCollection.find({bloggerId: bloggerId}).project({ _id: 0}).skip(skipSize).limit(PageSize).toArray()
            }
    },

    async findPostById(postId: string) {
        const post = await postsCollection.findOne({id: postId}, {projection: {_id: 0}})
        if (!post) {
            return false
        }
        return post
    },

    async updatePostById(postId: string, newTitle: string, newShortDescription: string, newContent: string, newBloggerId: number) {
        const updatedPost = await postsCollection.findOne({id: postId})
        if (updatedPost) {
            await postsCollection.updateOne({id: postId}, {
                $set:
                    {
                        title: newTitle,
                        shortDescription: newShortDescription,
                        content: newContent,
                        bloggerId: newBloggerId
                    }
            });
            return true
        } else return false

    },
    async deletePostById(postId: string) {
        const deletedPost = await postsCollection.deleteOne({id: postId})
        if (deletedPost.deletedCount > 0) {
            return true
        }
        return false
    }


}