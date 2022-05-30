import express, {NextFunction, Request, Response} from "express"
import {body, validationResult} from "express-validator";
import {postInputValidatorMiddleware} from "../middlewares/validatorMiddleware";
import {bloggersRepo} from "../repos/bloggersRepo";
import {authMiddleware} from "../middlewares/authMiddleWare";
import {bloggersCollection} from "../repos/db";
import {bloggersRouter} from "./bloggersRouter";
import {postsService} from "../domains/postsService";
import {bloggersService} from "../domains/bloggersService";

export const postsRouter = express.Router()

postsRouter.get('/', async (req: Request, res: Response) => {
    const PageNumber: Nullable<number> = Number(req.query.PageNumber);
    const PageSize: Nullable<number> = Number(req.query.PageSize);
    const allPosts = await postsService.getAll(PageNumber, PageSize)
    res.status(200).send(allPosts)
})

postsRouter.post('/',
    authMiddleware,
    postInputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        let myErrors = []
        for (let i = 0; i < errors.array().length; i++) {
            myErrors.push({"message": errors.array()[i].msg, "field": errors.array()[i].param})
        }
        if (!(await bloggersService.getBloggerById(req.body.bloggerId))) {
            myErrors.push({"message": "specific bloggerId not exists", "field": "bloggerId"})
        }
        if (!errors.isEmpty() || myErrors.length > 0) {
            return res.status(400).send({
                errorsMessages: myErrors,
                "resultCode": 1
            });
        } else {
            const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
            return res.status(201).send(newPost)
        }
    })

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const foundPost = await postsService.findPostById(req.params.id)
    if (foundPost) {
        res.status(200).send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.put('/:id',
    authMiddleware,
    postInputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        let myErrors = []
        for (let i = 0; i < errors.array().length; i++) {
            myErrors.push({"message": errors.array()[i].msg, "field": errors.array()[i].param})
        }
        if (!(await bloggersService.getBloggerById(req.body.bloggerId))) {
            myErrors.push({"message": "specific bloggerId not exists", "field": "bloggerId"})
        }
        if (!errors.isEmpty() || myErrors.length > 0) {
            return res.status(400).send({
                errorsMessages: myErrors,
                "resultCode": 1
            });
        }  else {
            const isUpdated = await postsService.updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
            if (isUpdated) {
                return res.sendStatus(204)
            } else {
                return res.sendStatus(404)
            }
        }
    })

postsRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
    const isDeleted = await postsService.deletePostById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })