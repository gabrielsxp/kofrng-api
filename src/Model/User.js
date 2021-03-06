const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const FighterCollectionController = require('../Controller/FighterCollectionController');
const FavouritesController = require('../Controller/FavouritesController');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            this.username = value.replace(' ', '_');
        }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
            },
            message: () => 'Invalid email'
        }
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    tokens: [{
        token: String
    }],
    fighterCollection: { type: mongoose.Types.ObjectId },
    favourites: { type: mongoose.Types.ObjectId }
});

/**
 * Método responsavel por procurar e retornar um usuario de acordo com
 * o nome de usuario e a senha recebidos como parametro.
 */
UserSchema.statics.findByCredentials = async function (email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('This user does not exists');
        }

        const matchPasswords = await bcrypt.compareSync(password, user.password);
        if (!matchPasswords) {
            throw new Error('Incorrect Credentials');
        }
        return user;
    } catch (error) {
        throw error;
    }
}

/**
 * Metodo responsavel por verificar se um determinado password corresponde
 * ao password atual de um usuario
 */
UserSchema.statics.checkPasswords = async function (id, password) {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('This user does not exists');
        }
        const matchPasswords = await bcrypt.compareSync(password, user.password);
        console.log('matches: ' + matchPasswords);
        return matchPasswords;
    } catch (error) {
        return new Error(error);
    }
}

/**
 * Metodo responsavel por receber o objeto original do usuario e 
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
 * Metodo utilizado para gerar um token de autenticacao, de modo que 
 * o usuario possui varios tokens salvos em um array, permitindo a
 * autenticacao do mesmo em diversos dispositivos.
 */
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    console.log(__dirname);
    var privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), { encoding: 'utf8' });
    const token = await jwt.sign({ _id: user._id.toString() }, privateKey);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

/**
 * Metodo utilizado para gerar uma colecao vazia de invocacoes favoritas e 
 * associa-la ao usuario em questao
 */
UserSchema.methods.createFavourites = async function(userId){
    const user = this;
    try {
        const favourites = await FavouritesController.createFavourite(userId);
        user.favourites = favourites._id;
        await user.save();

        return favourites;
    } catch(error){
        throw new Error(error);
    }
}

/**
 * Metodo utilizado para gerar uma colecao vazia de personagens e 
 * associa-la ao usuario em questao
 */
UserSchema.methods.createCollection = async function () {
    const user = this;
    console.log(user);
    try {
        const collection = await FighterCollectionController.createCollection(user._id);
        user.fighterCollection = collection._id;
        await user.save();

        return collection;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Middleware responsavel por verificar se existe alguma alteracao na senha
 * do usuario e se houver, utilizar o metodo RS256 para criptografar a referida
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

