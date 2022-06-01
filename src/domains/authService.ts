import {UserDBType} from "../repos/types";
import {usersRepository} from "../repos/usersRepo";
import {settings} from "../settings";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import {usersService} from "./usersService";


export const authService = {
    // async getAllUsers(): Promise<UserDBType[]> {
    //     return usersService.getAll()
    // },
    /**
     *
     * @param email
     * @param password
     * @return null if credentials are incorrect and admin entity in opposite case
     */
    async checkCredentials(login: string, password: string): Promise<UserDBType | null> {
        let user = await usersRepository.findByLogin(login)
        if (!user) {
            return null
        }
        let result = await bcrypt.compare(password, user.passwordHash)
        if (result) {
            return user
        }
        return  null
    },

    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    // async checkAndFindUserByToken(token: string) {
    //     try {
    //         const result: any = jwt.verify(token, settings.JWT_SECRET)
    //         const user = await usersRepository.findById(new ObjectId(result.userId))
    //         return user
    //     } catch (error) {
    //         return null
    //     }
    // }
}
