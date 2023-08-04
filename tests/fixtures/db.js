const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Users = require('../../src/models/user');
const Tasks = require('../../src/models/task');

const testUserId = new mongoose.Types.ObjectId()
const testUser = {
    _id:testUserId,
    name:'Mike',
    email:'mike@example.com',
    password:'Mike1234!',
    tokens:[{
        token:jwt.sign({_id:testUserId}, process.env.JWT_SECRET)
    }]
}

const testSecondUserId = new mongoose.Types.ObjectId()
const testSecondUser = {
    _id:testSecondUserId,
    name:'Daniil',
    email:'daniil@example.com',
    password:'Daniil1234!',
    tokens:[{
        token: jwt.sign({_id:testSecondUserId}, process.env.JWT_SECRET)   
    }]
}

const firstTask = {
    _id:new mongoose.Types.ObjectId(),
    description:'firstTask',
    completed:false,
    owner:testUser._id
}

const secondTask = {
    _id:new mongoose.Types.ObjectId(),
    description:'secondTask',
    completed:true,
    owner:testUser._id
}
const thirdTask = {
    _id:new mongoose.Types.ObjectId(),
    description:'thirdTask',
    completed:true,
    owner:testSecondUser._id
}

const setupDatabase = async () => {
    await Users.deleteMany()
    await Tasks.deleteMany()
    await new Users(testUser).save()
    await new Users(testSecondUser).save()
    await new Tasks(firstTask).save()
    await new Tasks(secondTask).save()
    await new Tasks(thirdTask).save()
}

module.exports = {
    testSecondUser,
    testSecondUserId,
    testUserId,
    testUser,
    setupDatabase,
    firstTask
}