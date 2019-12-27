const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            this.username = value.replace(' ','_');
        }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    tokens: [{
        token: String
    }]
});

/**
 * Método responsável por procurar e retornar um usuário de acordo com
 * o nome de usuário e a senha recebidos como parâmetro.
 */
UserSchema.statics.findByCredentials = async function (username, password) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('This user does not exists');
        }

        const matchPasswords = await bcrypt.compareSync(password, user.password);
        if (!matchPasswords) {
            throw new Error('Passwords does not matches');
        }
        return user;
    } catch (error) {
        return new Error(error);
    }
}

/**
 * Método responsável por receber o objeto original do usuário e 
 * remover os atributos de maior importância a fim de garantir a 
 * segurança e privacidade dos dados ao retornar o objeto para o
 * front-end
 */
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

/**
 * Método utilizado para gerar um token de autenticação, de modo que 
 * o usuário possui vários tokens salvos em um array, permitindo a
 * autenticação do mesmo em diversos dispositivos.
 */
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log(__dirname);
    var privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), {encoding: 'utf8'});
    const token = await jwt.sign({ _id: user._id.toString() }, privateKey);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

/**
 * Middleware responsável por verificar se existe alguma alteração na senha
 * do usuário e se houver, utilizar o método RS256 para criptografar a referida
 * senha a fim de armazena-la no banco de dados.
 */
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const password = user.password;
        const hashedPassword = bcrypt.hashSync(password, 8);
        user.password = hashedPassword;
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

