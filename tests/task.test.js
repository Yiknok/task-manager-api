const request = require('supertest');
const app = require('../src/app')
const Task = require("../src/models/task")
const {setupDatabase, testUser, testUserId, firstTask, testSecondUser} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a task', async ()=>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            description: 'Spend time with friends'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(testUserId).toEqual(task.owner)
})

test('Should return tasks for first user', async()=>{
    const response = await request(app)
        .get('/tasks?sortBy=completed:asc')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete first task', async()=>{
    await request(app)
        .delete(`/tasks/${firstTask._id}`)
        .set('Authorization', `Bearer ${testSecondUser.tokens[0].token}`)
        .send()
        .expect(404)
        const task = await Task.findById(firstTask._id)
        expect(task).not.toBeNull()
})