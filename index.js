require('dotenv').config();
const { authKey, authGet, authAddUser } = require('./middleware/middleware');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3012;
const { nanoid } = require('nanoid')
const { UserModel } = require('./models/UserModel');

app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Routes go here
app.get(
  '/:key',
  [ authKey(process.env.PASSWORD)],
  (req, res) => {
    const query = UserModel.find({});
    query.exec(function (err, user) {
      if (err) {
        console.log(err);
      }
      res.json(user);
    });
    // console.log(user);
  }
);


app.post(
  '/addContact/:key',
  [ authKey(process.env.PASSWORD)],
  async (req, res) => {
    const user = req.body;
    user.key = nanoid()
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(newUser);
  }
);

app.post(
  '/:key/editContact',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    const user = req.body;
    UserModel.updateOne({ key: user.key }, user, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        const query = UserModel.findOne({
          key: user.key,
        });
        query.exec(function (err, user) {
          if (err) {
            console.log(err);
          }
          res.json(user);
        });
      }
    });
  }
);

app.post(
  '/:key/deleteContact',
  [authKey(process.env.PASSWORD)],
  async (req, res) => {
    const key = req.body.key;
    UserModel.deleteOne({ key: key }).then((result) => {
      res.json(result);
    });
  }
);

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('listening for requests on Port: ' + PORT);
  });
});
