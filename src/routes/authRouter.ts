import express, {Request, Response} from "express"
import {authService} from "../domains/authService";
import {jwtUtility} from "../application/jwt-utility";
import {log} from "util";
import {loginValidatorMiddleware} from "../middlewares/validatorMiddleware";
import {validationResult} from "express-validator";
import {errorHandler} from "../application/error-handler";

export const authRouter = express.Router()

authRouter.post("/login",
    loginValidatorMiddleware,
    async (req: Request, res: Response) => {
    // errorHandler,
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

    const user = await authService.checkCredentials(req.body.login, req.body.password)
    if (user) {
        const token = await jwtUtility.createJWT(user)
        res.status(200).send({"token": token})
    } else {
        res.sendStatus(401)
    }
})