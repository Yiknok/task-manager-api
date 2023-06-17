const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const taskRouter = express.Router()

//Create Task
taskRouter.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send()
    }

})

// Read many Tasks
taskRouter.get('/tasks', auth, async (req, res) => {

    const findFilter = { owner: req.user._id }
    if (req.query.completed) {
        findFilter.completed = req.query.completed === 'true'
    }
    
    const sort = {}
    const sortParams = req.query.sortBy.split(':')
    if(req.query.sortBy){
        sort[sortParams[0]] = sortParams[1]==='asc' ? 1:-1
    }

    try {
        const tasks = await Task.find(findFilter,null,{limit:parseInt(req.query.limit),skip:parseInt(req.query.skip), sort})
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// Read Concrete Task
taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('Task Not Found!!!')
        }
        res.send(task)
    } catch (error) {
        res.status(400).send('Server Error')
    }

})

//update task info
taskRouter.put('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdate = ['completed', 'description']
    const isAllowedToUpdate = updates.every((update) => allowedUpdate.includes(update))

    if (!isAllowedToUpdate) {
        res.status(400).send({ error: 'Not find property to update' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (err) {
        res.status(400).send({ error: 'Validation fail' })
    }
})

//delete task
taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task not found!' })
        }

        res.send(task)
    } catch (err) {
        res.status(500).send({ error: 'Server error!' })
    }
})

module.exports = taskRouter

