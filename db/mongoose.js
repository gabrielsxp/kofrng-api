const mongoose = require('mongoose');

if (process.env.ENV === 'production') {
    mongoose.connect(`mongodb://${process.env.MONGOOSE_DB_USER}:${process.env.MONGOOSE_DB_PASSWORD}@${process.env.MONGOOSE_DB_URL}/kofastools`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
} else {
    mongoose.connect('mongodb://127.0.0.1:27017/kofrng', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}

