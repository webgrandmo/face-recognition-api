const express = require('express'),
    bodyParser = require('body-parser'),
    bcrypt = require('bcrypt'),
    cors = require('cors'),
    saltRounds = 10,
    knex = require('knex');

    const db = knex({
        client: 'pg',
        connection: {
          host : '127.0.0.1',
          user : 'postgres',
          password : '1488',
          database : 'smart-brain'
        }
      });


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
    db.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email )
        .then(data => {
            const isValid = bcrypt.compare(req.body.password, data[0].hash);
            if(isValid) {
                return db.select('*').from('users')
                    .where('email', '=' , req.body.email)
                    .then(user => {
                        res.json(user[0])
                    }).catch(err => {
                        res.status(404).json('Unable to sign in');
                    })
            } else {
                res.status(404).json('Wrong username or password');
            }
        }).catch(err => {
            res.status(404).json('Unable to sign in');
        })
});


//Register
app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password, 10);
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            }).then(user => {
                res.json(user[0]); 
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)

    }).catch(err => res.status(404).json('Unable to register'));
})

//Profile
app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    db('users').select('*').from('users').where({id}).then(user => {

        if(user.length) {

            res.json(user[0]);
        } else {
            res.status(404).json('User not found');
        }
    })

})

//Image entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(404).json('Something went wrong'));
})

