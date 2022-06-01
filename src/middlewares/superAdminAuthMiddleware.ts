import {NextFunction, Request, Response} from 'express'

export const superAdminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // check Basic auth for login/pass pair: superadmin/12345

    let login = "superadmin"
    let password = "12345"

    let buff = Buffer.from(login + ":" + password)
    let validAuthValue = "Basic " + buff.toString('base64')
    const headerAuth = req.headers.authorization
    if (headerAuth === validAuthValue) {
        next()
    }
    else {
        res.send(401)}
}
