const express = require('express')
const taskRouter = require('./router/task')
const userRouter = require('./router/user')
require('./db/mongodb')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports = app
