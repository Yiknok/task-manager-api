const request = require('supertest')
const Users = require('../src/models/user')
const app = require('../src/app')
const {setupDatabase,testUser, testUserId} = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should signup a new user', async ()=>{
    const response = await request(app).post('/users').send({
        name:'Danya',
        email:'danya@example.com',
        password:'danya1234!'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = Users.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user:{
            name:'Danya',
            email:'danya@example.com'
        },
    })
    expect(user.password).not.toBe("danya1234!")
})

test('Should login existing user', async()=>{
    await request(app).post('/users/login').send({
        email:testUser.email,
        password:testUser.password
    }).expect(200)
})

test('Should not login nonexistent user', async ()=>{
    await request(app).post('/users/login').send({
        email:testUser.email,
        password:2
    }).expect(400)
})

test('Should get back user profile', async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user profile', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)  

    const user = await Users.findById(testUserId)
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})