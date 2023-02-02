const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');


//DB -> is nothing but the connection string obtained from the mongodb website
const DB = process.env.DATABASE.replace( 
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//Listening to the connected PORT
//Connecting to the database

const PORT = process.env.PORT || 3000
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:3000")
    });
  });


