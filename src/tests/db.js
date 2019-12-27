const User = require('../Model/User');
const mongoose = require('mongoose');
require('../../db/mongoose_test');

const userId = new mongoose.Types.ObjectId();
const user = {
    _id: userId,
    username: 'user 1',
    password: 'genericpassword',
    email: 'user@user.com',
    role: 0
}

const adminId = mongoose.Types.ObjectId('5e054a2ae369244440862f1c');
const admin = {
    _id: adminId,
    username: 'admin',
    password: 'password',
    email: 'admin@email.com',
    role: 1,
    tokens: [{
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc0MDQ5OTJ9.9jnYCHGpS6s1lssF6smBH5km-Ltq0zWAaHobn5CQdFs'
    }]
};

const someUser = {
    username: 'username',
    password: 'password',
    email: 'email@email.com'
}

const invalidUserId = new mongoose.Types.ObjectId();
const invalidUser = {
    _id: invalidUserId,
    username: 'invalid_user',
    password: 'genericpassword',
    email: 'invalid_user@user.com',
    role: 0
}

const clearDatabase = async () => {
    await User.deleteMany({}).exec();
}

const clearUser = async () => {
    await User.findByIdAndDelete(someUser._id);
}

const createAdmin = async () => {
    await User.create({...admin});
}

const createUser = async () => {
    await User.create(user);
}

const setupDatabase = async () => {
    await clearDatabase();
    await createUser();
    await createAdmin();
}

const deleteUser = async () => {
    await setupDatabase();
    await User.findByIdAndDelete(user._id);
}

const updateUserEmail = async () => {
    await setupDatabase();
    const currentUser = await User.findById(user._id);
    currentUser.email = 'newUser@user.com';

    await currentUser.save();
}

const updateUserUsername = async () => {
    await setupDatabase();
    const currentUser = await User.findById(user._id);
    currentUser.username = 'user_2';
    
    await currentUser.save();
}

const getUser = async () => {
    await setupDatabase();
    const currentUser = await User.findById(user._id);
    
    return currentUser;
}

module.exports = {
    user,
    setupDatabase
};