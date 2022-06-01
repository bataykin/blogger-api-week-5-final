import {usersCollection} from './db'
import {UserDBType} from './types'
import {ObjectId} from 'mongodb'

export const usersRepository = {
    async getAll(PageSize: number = 10, skipSize: number) {
        const result = await usersCollection
            .find({}, {projection: {_id: 0, passwordHash: 0, createdAt: 0}})
            .skip(skipSize)
            .limit(PageSize)
            .sort('createdAt', -1)
            .toArray();
        return result
    },

    async create(user: UserDBType) {
        const result = await usersCollection.insertOne(user)
        if (result) {
            //пробую деструктуризацию
            const {id, login} = user
            return {id, login}
        } else {
            return false
        }
    },

    async findById(id: string) {
        let user = await usersCollection.findOne({id: id})
        if (user) {
            return user
        } else {
            return null
        }
    },

    async findByLogin(login: string): Promise<UserDBType | null> {
        const user = await usersCollection.findOne({login: login})
        return user
    },

    async delete(id?: string) {
        if (id) {
            const isDeleted = await usersCollection.deleteOne({id: id})
            return isDeleted.deletedCount > 0
        } else {
            const isDeleted = await usersCollection.deleteMany({})
            return isDeleted.deletedCount > 0
        }
    },


}

