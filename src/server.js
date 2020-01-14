const app = require('./app');
const dotenv = require('dotenv').config();

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
    console.log('Server is running');
})