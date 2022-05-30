import {bloggersCollection} from "./db";

export const bloggersRepo = {

    async searchNameByTerm(searchNameTerm: string | null, skipSize: number, pageSize: number): Promise<{}>{
        const searched  = await bloggersCollection.find({name: {$regex: searchNameTerm}}).project({_id: 0}).skip(skipSize).limit(pageSize).toArray()
        return searched
    },

    async createBlogger(newBlogger: { id: string; name: string; youtubeUrl: string; }) {
        await bloggersCollection.insertOne(newBlogger)
        const createdBlogger=  await bloggersCollection.findOne({id: newBlogger.id}, {projection: {_id: 0}})
        return createdBlogger
    },

    async findBloggerById(bloggerId: string) {
        const blogger = await bloggersCollection.findOne({id: bloggerId}, { projection: { _id: 0 } })
        if (!blogger) {
            return false
        }
        return blogger
    },

    async updateBloggerById(bloggerId: string, name: string, youtubeUrl: string) {
        const updatedBlogger = await bloggersCollection.findOne({id: bloggerId})
        if (updatedBlogger) {
            await bloggersCollection.updateOne({id: bloggerId},
                {
                    $set:
                        {
                            name: name,
                            youtubeUrl: youtubeUrl
                        }
                })
            return true
        } else return false
    },

    async deleteBloggerById(bloggerId: string) {
        const deletedBlogger = await bloggersCollection.deleteOne({id: bloggerId})
        if (deletedBlogger.deletedCount>0) {
            return true
        }
        return false

    },
    async findBloggerNameById(bloggerId: number) {
        const bloggerNameById = await bloggersCollection.findOne({id: bloggerId}, {name: 1, _id: 0})
        if (bloggerNameById) {
            return bloggerNameById.name
        }

            return false
    },

}