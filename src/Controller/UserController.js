const User = require('../Model/User');

module.exports = {
    async signUp(req, res) {
        const validFields = ['username', 'password', 'email'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));
        if (!valid) {
            return res.send(400).send({ error: 'Invalid Fields' });
        }

        try {
            const user = await User.create(req.body);
            if (user) {
                const token = await user.generateAuthToken();
                return res.status(201).send({ user, token });
            } else {
                return res.status(400).send({ error: 'This email is already in use !' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error.message });
        }
    },
    async signIn(req, res) {
        const validFields = ['username', 'password', 'email'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));

        if (!valid) {
            return res.status(400).send({ error: 'Invalid Fields' });
        }

        try {
            const user = await User.findByCredentials(req.body.username, req.body.password);
            console.log(user);
            if (!user) {
                return res.status(400).send('Invalid data');
            }
            const token = await user.generateAuthToken();
            return res.status(200).send({ user, token });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }

    },
    async update(req, res){
        const validFields = ['email', 'password'];
        const fields = Object.keys(req.body);
        const valid = fields.every((field) => validFields.includes(field));

        if(!valid){
            return res.status(400).send({error: 'Invalid fields'});
        }

        try {
            const user = await User.findById(req.params.id);
            if(!user){
                return res.status(404).send({error: 'User not found'});
            }
            fields.forEach((update) => user[update] = req.body[update]);
            await user.save();
            
            return res.status(200).send({message: 'User updated'});
        } catch(error){
            return res.status().send({error});
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
    }
}