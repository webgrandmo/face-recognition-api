const express = require('express'),
    bodyParser = require('body-parser'),
    bcrypt = require('bcrypt'),
    cors = require('cors'),
    saltRounds = 10;


const database = {
    users: [
        {
            id: "1",
            name: "John",
            email: "john.doe@gmail.com",
            password: "cookie",
            entries: 0,
            joined: new Date()
        },
        {
            id: "2",
            name: "Sally",
            email: "sally.doe@gmail.com",
            password: "carrot",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "123",
            email: "john.doe@gmail.com",
            hash: ""
        }
    ]
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get( '/', (req, res) => {
    res.json(database.users);
});

//Sign in
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(404).json('Error whili logging in');
    }
});


//Register
app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
   database.users.push(
       {
            id: "3",
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()           
       }
   )
   res.json(database.users[database.users.length - 1]); 
})

//Profile
app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    let found = false;
    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })

    if (!found) {
        res.status(404).json('No user with such ID');
    }

})

//Image entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            user.entries ++;
            return res.json(user.entries);
        }
    })

    if (!found) {
        res.status(404).json('No user with such ID');
    }    
})

app.listen(3001, () => {
    console.log('Everything is working fine');
});
