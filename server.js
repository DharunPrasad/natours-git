const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');


//DB -> is nothing but the connection string obtained from the mongodb website
const DB = process.env.DATABASE.replace( 
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Connecting to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection is succesfull');
  });
//Listening to the connected PORT
const port = process.env.PORT
app.listen(port, () => {
  console.log("Server is running on http://localhost:3000")
});
