import {postsRepo} from "../repos/postsRepo";
import express, {NextFunction, Request, Response} from "express"
import {body, validationResult} from "express-validator";
import {postInputValidatorMiddleware} from "../middlewares/validatorMiddleware";
import {bloggersRepo} from "../repos/bloggersRepo";
import {authMiddleware} from "../middlewares/authMiddleWare";
import {bloggersCollection} from "../repos/db";
import {bloggersRouter} from "./bloggersRouter";

export const postsRouter = express.Router()

postsRouter.get('/',  async (req: Request, res: Response) => {
    const allPosts = await postsRepo.getPosts(Number(req.query.PageNumber), Number(req.query.PageSize))
    res.status(200).send(allPosts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const foundPost = await postsRepo.findPostById(+req.params.id)
    if (foundPost) {
        res.status(200).send(foundPost)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.post('/',
    authMiddleware,
    postInputValidatorMiddleware,
    // body('bloggerId')
    // .exists().withMessage("field bloggerId not exists").bail()
    // .isNumeric().withMessage("not a numeric value").bail(),

    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        let myErrors = []
        for (let i = 0; i < errors.array().length; i++) {
            myErrors.push({"message": errors.array()[i].msg, "field": errors.array()[i].param})
        }
        if (!(await bloggersRepo.findBloggerById(+req.body.bloggerId))) {
            myErrors.push({"message": "specific bloggerId not exists", "field": "bloggerId"})
        }
        if (!errors.isEmpty() || myErrors.length > 0) {
            return res.status(400).send({
                errorsMessages: myErrors,
                "resultCode": 1
            });
        } else {
            const newPost1 = await postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
            res.status(201).send(newPost1)
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
        if (!(await bloggersRepo.findBloggerById(+req.body.bloggerId))) {
            myErrors.push({"message": "specific bloggerId not exists", "field": "bloggerId"})
        }
            if (!errors.isEmpty() || myErrors.length > 0) {
            return res.status(400).json({
                errorsMessages: myErrors,
                "resultCode": 1
            });
        } else if (!await postsRepo.findPostById(+req.params.id)) {
                myErrors.push({"message": "bloggerId not exists", "field": "bloggerId"})
                res.sendStatus(404)
            }
            else {
            const isUpdated = await postsRepo.updatePostById(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
            if (isUpdated) {
                res.sendStatus(204)
            } else    {

            }
        }
    })

postsRouter.delete('/:id',
    authMiddleware,

    async (req: Request, res: Response) => {
        if (await postsRepo.deletePostById(+req.params.id)) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })