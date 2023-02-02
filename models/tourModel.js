const mongoose = require("mongoose")
const slugify = require("slugify")
//Creating Mongoose Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true
  },
  slug : {
    type : String,
  },
  duration: {
    type: Number,
    required: [true, "Duration is mandatory"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "maxGroupSize field is mandatory"]
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty field is mandatory"]
  },
  ratingsAverage: {
    type: Number,
    default: 3.0
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true, //Only works for strings, removes empty spaces in the beginning and the end of the string
    required : [true, "Summary is mandatory"]
  },
  description : {
    type : String,
    trim : true //Only works for strings, removes empty spaces in the beginning and the end of the string
  },
  imageCover : {
    type : String,
    required : [true, "Cove image is mandatory"]
  },
  images : {
    type : [String],
  },
  startDates : {
    type : [Date],
  }
},{
  toJSON : {virtuals : true},
  toObject : {virtual : true}
},{timestamps : true})

// tourSchema.virtual("durationWeeks").get(function(){
//   return this.duration / 7
// })

//WORKING ON DOUCUMENT MIDDLWARE 
// document middleware in mongoose or mongodb is nothing but a intermediate function 
// that is run before or after creating or saving a document to the database


//This is pre middleware that executes before the instance of saving the document to the database
tourSchema.pre("save", function(next){
   this.slug = slugify(this.name, {lower : true}) //Creating a slug using middleware function
  next()
})

//This is a post middleware that executes after 
tourSchema.post("save", (doc, next) => {
  console.log(doc)
  next()
})

tourSchema.pre("save", () => {
  console.log("Middleware is running....")
})

//Creating Mongoose Model
const Tour = mongoose.model('Tour', tourSchema);

//Exports
module.exports = Tour
