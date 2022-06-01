import {Request, Response, Router} from 'express'
import {usersService} from '../domains/usersService'
import {superAdminAuthMiddleware} from '../middlewares/superAdminAuthMiddleware'
import {authMiddleware} from "../middlewares/authMiddleWare";
import {Nullable} from "../types/global";
import {loginValidatorMiddleware} from "../middlewares/validatorMiddleware";
import {validationResult} from "express-validator";

export const usersRouter = Router({})

usersRouter
    // .use(superAdminAuthMiddleware)
    .get('/', async (req: Request, res: Response) => {
        const PageNumber: Nullable<number> = Number(req.query.PageNumber);
        const PageSize: Nullable<number> = Number(req.query.PageSize);
        const users = await usersService.getAll(PageNumber, PageSize)
        return res.status(200).send(users)
    })


    .post('/',
        authMiddleware,
        loginValidatorMiddleware,
        async (req: Request, res: Response) => {
            const errors = validationResult(req)
            let myErrors = []
            for (let i = 0; i < errors.array().length; i++) {
                myErrors.push({"message": errors.array()[i].msg, "field": errors.array()[i].param})
            }
            if (!errors.isEmpty()) {
                res.status(400).send({
                    errorsMessages: myErrors,
                    "resultCode": 1
                })
                return
            }

            const newUser = await usersService.create(req.body.login, req.body.password)
            return res.status(201).send(newUser)
        })

    .delete('/:id',
        authMiddleware,
        async (req:Request, res: Response) => {
        const user = await usersService.findUserById(req.params.id)
        if (!user) {
            return res.sendStatus(404)
        } else {
            const isDeleted = await usersService.deleteById(req.params.id)
            if (isDeleted) {
                return res.sendStatus(204)
            }
        }
    })