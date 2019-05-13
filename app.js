const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');

//main routes//
const ankiRoutes = require('./routes/anki');
const deckRoutes = require('./routes/deck');
const translateRoutes = require('./routes/translate');
const userRoutes = require('./routes/user');
const videoRoutes = require('./routes/video');

const app = express();

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('mongoDB connected'))
  .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//auth route
app.use('/api/auth', authRoutes);

//main routes//
app.use('/api/anki', ankiRoutes);
app.use('/api/deck', deckRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);

if (process.env.NODE_ENV === 'production') {
  //create file for loader.io verification
  let stream = fs.createWriteStream(
    'client/dist/client/' + keys.loaderio + '.txt'
  );
  stream.once('open', function(fd) {
    stream.write(keys.loaderio);
    stream.end();
  });
  //make client available
  app.use(express.static('client/dist/client'));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'client', 'dist', 'client', 'index.html')
    );
  });
}

module.exports = app;
