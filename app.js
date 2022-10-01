const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findUsername, showInfos, database } = require('./database');
const { resultBcrypt, translateToBcrypt } = require('./bcrypt-auth');
const cors = require('cors');
const store = session.MemoryStore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}))
app.use(
  session({
    secret: "secret-key",
    cookie: {
      maxAge: 728346,
      secure: false,
      sameSite: 'none'
    },
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user[0].id);
})

passport.deserializeUser((id, done) => {
  done(null, showInfos(id)[0].info)
})

passport.use(new LocalStrategy(
  async function (username, password, done) {
    if (findUsername(username) === 'user not found') {
      done(null, false)
    } else {
      const verify = await resultBcrypt(password, findUsername(username)[0].password);
      if (verify) {
        done(null, findUsername(username))
      } else {
        done(null, false)
      }
    }
  }
))

app.get('/login', (req, res, next) => {
  res.json({ message: 'please login using post request' });
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res, next) => {
  res.redirect('/dashboard')
});

app.post('/register', async(req, res, next) => {
  const { username, password, info } = req.body;
  async function registerData() {
    const passHash = await translateToBcrypt(password, 12)

    // Spread Syntax do'nt ever try to uncomment it lol.
    // return [...database, {
    //   id: database.length + 1,
    //   username: username,
    //   password: passHash,
    //   info: info
    // }]
    
    // use this JSON file in /register route
    // {
    //     "username": "asdasd",
    //     "password": "asdfg34",
    //     "info": {
    //         "name": "gagyty",
    //         "course": "ajksrfg"
    //     }
    // }
    database.push({
      id: database.length + 1,
      username: username,
      password: passHash,
      info: info
    });
  }
  res.json(await registerData())
});

app.get('/dashboard', (req, res, next) => {
  if (req.user) {
    res.send('welcome, ' + req.user.name)
  } else {
    res.json({ message: ' you are not allowed to view this page' })
  }
});

app.use((req, res, next) => {
  const error = new Error('endpoint not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message })
});

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`)
});