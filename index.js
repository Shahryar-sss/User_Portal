const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const register = require('./routes/register');
const login = require('./routes/login');
const image = require('./routes/image');

var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/User_Portal", {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("Could not connect to MongoDB"));

app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/register', register);
app.use('/login', login);
app.use('/image', image);

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/account', (req,res) => {
    res.render('account');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})