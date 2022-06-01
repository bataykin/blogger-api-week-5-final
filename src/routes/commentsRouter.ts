import express, {Request, Response} from "express"
import {commentsService} from "../domains/commentsService";

export const commentsRouter = express.Router()

commentsRouter.put('/:commentId', async (req: Request, res: Response) => {
    const isUpdated = await commentsService.updateCommentById(req.params.commentId, req.body.content)
    if (isUpdated) {
        res.status(200).send(isUpdated)
    } else
        res.sendStatus(404)
})

commentsRouter.delete("/:id", async (req: Request, res: Response) => {
    const isDeleted = await commentsService.deleteCommentById(req.params.id)
    if(isDeleted) {
        return res.status(204)
    } else {
        return res.status(404)
    }
})

commentsRouter.get ("/:id", async (req:Request, res:Response) => {
    const comment = await commentsService.getCommentById(req.params.id)
    if (comment) {
        return res.status(200).send(comment)
    } else {
        return res.status(404)
    }
})


