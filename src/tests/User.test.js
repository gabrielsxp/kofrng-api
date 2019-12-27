const User = require('../Model/User');
const db = require('./db');

beforeAll(() => {
    return db.setupDatabase();
});

describe('Tests of User Model', () => {
    it('Testing if the validation of blank spaces works', async () => {
        const user = await User.findById(db.user._id);
        expect(user.username).toBe("user_1");
    });

    it('Testing if the default role works', async () => {
        const user = await User.findById(db.user._id);
        expect(user.role).toBe(0);
    });

    it('Testing if the method of find a user by credentials works', async () => {
        const searchedUser = await User.findByCredentials('user_1', 'genericpassword');
        expect(searchedUser.username).toBe('user_1');
    });

    it('Testing if a invalid User can be found', async () => {
        const searchedUser = await User.findByCredentials('user_2', 'genericpassword');
        expect(searchedUser.message).toBe('Error: This user does not exists');
    });

    it('Testing if a valid user is found but the passwords does not matches', async () => {
        await db.setupDatabase();
        const searchedUser = await User.findByCredentials('user_1', 'genericpassword1');
        expect(searchedUser.message).toBe('Error: Passwords does not matches');
    });
})
