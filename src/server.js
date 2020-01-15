const app = require('./app');
const dotenv = require('dotenv').config();

port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})