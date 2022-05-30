import {Request, Response, NextFunction} from "express";
import {body} from "express-validator";

export const postInputValidatorMiddleware =
    // here we make validation. Also here we can transform returned object (for example to satisfy the Swagger API)
   [ body('title')
        .exists().withMessage("field title not exists").bail()
        .isString().withMessage("not a string value").bail()
        .trim("").notEmpty().withMessage("empty string").bail()
        .isLength({max: 30}).withMessage("more than 30 symbols"),
        body('shortDescription')
            .exists().withMessage("field shortDescription not exists").bail()
            .isString().withMessage("not a string value").bail()
            .trim("").notEmpty().withMessage("empty string").bail()
            .isLength({max: 100}).withMessage("more than 100 symbols"),
        body('content')
            .exists().withMessage("field content not exists").bail()
            .isString().withMessage("not a string value").bail()
            .trim("").notEmpty().withMessage("empty string").bail()
            .isLength({max: 1000}).withMessage("more than 1000 symbols")]
        // body('bloggerId')
        //     .exists().withMessage("field bloggerId not exists").bail()
        //     .isNumeric().withMessage("not a numeric value").bail()]




export const bloggerInputValidatorMiddleware =
 [       body('name')
    .exists().withMessage("field not exists").bail()
    .isString().withMessage("not a string value").bail()
    .trim("").notEmpty().withMessage("empty string").bail()
    .isLength({max: 15}).withMessage("more than 15 symbols"),
    body('youtubeUrl')
        .exists().withMessage("field not exists").bail()
        .isString().withMessage("not a string value").bail()
        .trim("").notEmpty().withMessage("empty string").bail()
        .isLength({max: 100}).withMessage("more than 100 symbols").bail()
        .matches(RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'))
        .withMessage("not URL value")]
