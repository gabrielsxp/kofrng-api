const app = require('./app');
const dotenv = require('dotenv').config();
app.listen(port, () => {
    console.log('Server is running');
})