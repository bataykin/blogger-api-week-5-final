import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // if (req.query.token === "123") {
    //         next()
    // } else res.sendStatus(401)
    if (req.headers.authorization == 'Basic YWRtaW46cXdlcnR5') {
        next()
        return;
    }
    res.sendStatus(401)

    return;
}
