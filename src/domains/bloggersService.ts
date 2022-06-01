import { bloggersRepo } from "../repos/bloggersRepo";
import {Nullable} from "../types/global";

export const bloggersService = {

    async getAll(SearchNameTerm: Nullable<string>, PageNumber:Nullable<number>, PageSize: Nullable<number>) {
        let searchNameTerm = String(SearchNameTerm).trim();
        const pageNumber = Number(PageNumber) || 1;
        const pageSize = Number(PageSize) || 10;
        let skipSize = 0
        // При вызове данной функции без query параметров searchNameTerm принимает значение "undefined" в силу приведения типов к String()
        // !!! Спросить на поддержке как избавиться от этой лишней проверки !!!
        if (searchNameTerm == "undefined") {
            searchNameTerm = ""
        }
        if (pageNumber > 1) {
            skipSize = pageSize * (pageNumber - 1)
        }
        const filteredAndPaginated = await bloggersRepo.searchNameByTerm (searchNameTerm,skipSize, pageSize)
        const result = {
                "pagesCount": Math.ceil(Object.keys(filteredAndPaginated).length / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": Object.keys(filteredAndPaginated).length,
                "items": filteredAndPaginated
            }
        return  result
    },

    async getBloggerById(bloggerId: string) {
        const blogger = await bloggersRepo.findBloggerById(bloggerId)
        if (!blogger) {
            return false
        }
        return blogger
    },

    async createBlogger (name: string, youtubeUrl: string) {
        const newBlogger = {
            id: Math.random()*1000000  + "",
            name: name,
            youtubeUrl: youtubeUrl
        }
        const createdBlogger = await bloggersRepo.createBlogger(newBlogger)
        return createdBlogger
    },

    async updateBloggerById(bloggerId: string, name: string, youtubeUrl: string) {
        const isUpdated = await bloggersRepo.updateBloggerById(bloggerId, name, youtubeUrl)
        return isUpdated
    },

    async deleteBloggerById(bloggerId: string) {
        const isDeleted = await bloggersRepo.deleteBloggerById(bloggerId)
        if (isDeleted) {
            return true
        }
        return false
    },

}