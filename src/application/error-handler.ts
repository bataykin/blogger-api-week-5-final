import {NextFunction, Request, Response} from "express";

import {validationResult} from "express-validator";

export const errorHandler =  (req: Request, res: Response, next: NextFunction) =>  {
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

    }
    return next()

}