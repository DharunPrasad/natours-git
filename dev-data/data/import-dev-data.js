const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require("./../../models/tourModel.js")
const fs = require("fs")


dotenv.config({ path: './../../config.env' });

//DB -> is nothing but the connection string obtained from the mongodb website
const DB = process.env.DATABASE.replace( 
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);


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


//Read JSON file
const tourData = JSON.parse(fs.readFileSync("tours-simple.json", "utf-8"))

const addData = async() => {
    try{
        await Tour.create(tourData)
        process.exit()
        console.log("Added data sucessfully")
    }
    catch(err){
        console.log("AddData Error", err)
    }
}

const deleteData = async() => {
    try {
        await Tour.deleteMany()//To delete all the data in that particular collection
        process.exit()
    }
    catch(err){
        console.log("DeleteData", err)
    }
}
if(process.argv[2] == "--import"){
    addData()
}
else if(process.argv[2] == "--delete"){
    deleteData()
}