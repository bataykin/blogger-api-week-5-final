import express = require('express');

import {authRouter} from "./routes/authRouter";
import {bloggersRouter} from "./routes/bloggersRouter";
import {commentsRouter} from "./routes/commentsRouter";
import {postsRouter} from "./routes/postsRouter";
import {usersRouter} from "./routes/usersRouter";

import {runDB} from "./repos/db";

import bodyParser from "body-parser";

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.use('/auth', authRouter)
app.use('/bloggers', bloggersRouter)
app.use('/comments', commentsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)


app.get('/', (req, res) => {
    res.send('Project was built from folder: ' + __dirname)
})

const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
