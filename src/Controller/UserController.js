const User = require('../Model/User');
const path = require('path');
const mkdirp = require('mkdirp');

function generatePassword(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%¨&*()",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports = {
    async signUp(req, res) {
        const validFields = ['username', 'password', 'email'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));
        if (!valid) {
            return res.send(400).send({ error: 'Invalid Fields' });
        }
        User.create(req.body, async (err, data) => {
            if (err) {
                return res.status(400).send({ error: 'Unable to create user' });
            }
            const token = await data.generateAuthToken();
            const collection = await data.createCollection();
            const favourites = await data.createFavourites(data._id);

            if (token && collection && favourites) {
                return res.status(201).send({ user: data, token });
            } else {
                return res.status(400).send({ error: 'Unable to create user' });
            }
        });
    },
    async signIn(req, res) {
        const validFields = ['username', 'password', 'email'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }

        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            console.log('user: ' + user);
            if (!user) {
                return res.status(400).send({ error: 'Invalid credentials' });
            }
            const token = await user.generateAuthToken();
            return res.status(200).send({ user, token });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }

    },
    async update(req, res) {
        const validFields = ['email', 'password'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid fields' });
        }

        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            fields.forEach((update) => user[update] = req.body[update]);
            await user.save();

            return res.status(200).send({ message: 'User updated' });
        } catch (error) {
            return res.status().send({ error });
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id;
            const user = await User.findByIdAndDelete(id);
            console.log(user);
            if (!user) {
                return res.status(404).send({ error: 'There is no user with this id' });
            }
            return res.status(200).send({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).send({ error });
        }
    },
    async validUsername(req, res) {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(200).send({ valid: true });
            }
            return res.status(200).send({ valid: false });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error._message, code: error.code });
        }
    },
    async validEmail(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(200).send({ valid: true });
            }
            return res.status(200).send({ valid: false });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error._message, code: error.code });
        }
    },
    async changePassword(req, res) {
        try {
            const matches = await User.checkPasswords(req.user._id, req.body.password);
            if (!matches) {
                return res.status(400).send({ error: 'Passwords does not matches' });
            }
            req.user.password = req.body.newPassword;
            const response = await req.user.save();
            if (!response) {
                return res.status(400).send({ error: 'Unable to save changes' });
            }
            return res.status(200).send({ success: true });
        } catch (error) {
            console.log(error.response);
            return res.status(500).send({ error: error });
        }
    },
    async generateNewPassword(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Unable to find this email');
            }
            const password = generatePassword();
            user.password = password;
            await user.save();

            return password;
        }
    }
}