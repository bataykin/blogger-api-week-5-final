import {usersRepository} from '../repos/usersRepo'
import {UserDBType} from '../repos/types'
import {ObjectId} from 'mongodb'
import {authService} from "./authService";
import {postsRepo} from "../repos/postsRepo";


export const usersService = {

    async getAll(PageNumber: number = 1, PageSize: number = 10) {
        let skipSize = 0
        const pageNumber = Number(PageNumber) || 1;
        const pageSize = Number(PageSize) || 10;
        if (pageNumber > 1) {
            skipSize = pageSize * (pageNumber - 1)
        }
        const usersPaginated = await usersRepository.getAll(pageSize, skipSize)
        const result = {
            "pagesCount": Math.ceil(Object.keys(usersPaginated).length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": Object.keys(usersPaginated).length,
            "items": usersPaginated
        }
        return result
    },

    async create(login: string, password: string) {
        const passwordHash = await authService.generateHash(password)
        const user: UserDBType = {
            id: Math.floor(Math.random() * 1000000000) + "",
            login: login,
            passwordHash: passwordHash,
            createdAt: new Date()
        }
        return await usersRepository.create(user)
    },

    async findUserById(id: string) {
        return usersRepository.findById(id)
    },

    async deleteById(id: string) {
        const isDeleted = await usersRepository.delete(id)
        return isDeleted

    }
}
