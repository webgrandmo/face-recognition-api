const express = require('express'),
    bodyParser = require('body-parser');

const app = express();

app.use( '/', (req, res) => {
    res.send('Works');
});

app.listen(3001, () => {
    console.log('Everything is working fine');
});


/*

signin - POST  => success/fail
register - POST => user
profile/:id GET => user(info)
image - PUT => image count 

*/