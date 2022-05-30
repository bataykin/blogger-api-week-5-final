import express, {Request, Response} from "express"
import {body, check, param, validationResult, ValidationError} from "express-validator";
import {authMiddleware} from "../middlewares/authMiddleWare";
import {bloggerInputValidatorMiddleware, postInputValidatorMiddleware} from "../middlewares/validatorMiddleware";
import {bloggersService} from "../domains/bloggersService";
import {postsService} from "../domains/postsService";


export const bloggersRouter = express.Router()

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const allBloggers = await bloggersService.getAll(String(req.query.SearchNameTerm), Number(req.query.PageNumber), Number(req.query.PageSize))
    res.status(200).send(allBloggers)
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const foundBlogger = await bloggersService.getBloggerById(req.params.id)
    if (foundBlogger) {
        res.status(200).send(foundBlogger)
    } else
        res.sendStatus(404)
})

bloggersRouter.post('/',
    authMiddleware,
    bloggerInputValidatorMiddleware,
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
        } else {
            const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)
            return res.status(201).send(newBlogger)
        }

    })

bloggersRouter.put('/:id',
    authMiddleware,
    bloggerInputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        let myErrors = []
        for (let i = 0; i < errors.array().length; i++) {
            myErrors.push({"message": errors.array()[i].msg, "field": errors.array()[i].param})
        }
        if (!errors.isEmpty()) {
            return res.status(400).send({
                errorsMessages: myErrors,
                "resultCode": 1
            });
        } else {
            const isUpdated = await bloggersService.updateBloggerById(req.params.id, req.body.name, req.body.youtubeUrl)
            if (isUpdated) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        }
    })

bloggersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBloggerById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

bloggersRouter.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const pageNumber = req.query.PageNumber;
    const foundBlogger = await bloggersService.getBloggerById(req.params.bloggerId)
    if (foundBlogger) {
        const foundSpecificPosts = await postsService.getAll(Number(pageNumber), Number(req.query.PageSize), req.params.bloggerId)
        return res.status(200).send(foundSpecificPosts)
    } else
        return res.sendStatus(404)
})

bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    postInputValidatorMiddleware,
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
        } else {
            const foundBlogger = await bloggersService.getBloggerById(req.params.bloggerId)
            if (!foundBlogger){
                res.sendStatus(404)
            } else {
                const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.bloggerId)
                res.status(201).send(newPost)
            }
        }
    })
