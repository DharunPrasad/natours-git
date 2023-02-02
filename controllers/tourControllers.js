const Tour = require("./../models/tourModel")
const ApiFeatures = require("./../utils/ApiFeatures")
/*-------OLD SET OF CODE--------- */

//Reading file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//   );

//Checks whether the ID is a valid one from the URL
// const checkId = (req,res,next, val) => {
//   console.log(`ID value ${val}`)
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Failed',
//     });
//   }
//   next()
// }


//To Check whether the input data contains the required inputs
// const checkBody = (req,res,next) => {
//   if(!req.body.price || !req.body.name){
//     return res.status(400).json({message : "Bad Request"})
//   }
//   next()
// }
/*-------OLD SET OF CODE--------- */

//To set up the alias route
const aliasTopTours = (req, res, next) => { //After alterating the req.query methods getAllTours will be executed to fetch the required datas
  //Mannually setting the req.query values
  req.query.limit = '5'
  req.query.sort = '-ratingAverage,price'
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next() //Need to move to the next middlewear or else would be stuck in here for ever
}

// To display longest tour ever
const aliasLongestTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = "-duration"
  req.query.fields = "name,price,ratingsAverage,duration"
  next()
}



//To get all the tours 
const getAllTours = async (req, res) => {
  try {
   
    const features = new ApiFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitField()
    .pagination()

    const tours = await features.query
    res.status(200).json({
      status: 'Success',
      result: tours.length,
      data: {
        tours,
      },
    });
  }
  catch (err) {
    res.status(400).json({
      status: "Failure",
      message: err.message
    })
  }
};

//To create a new tour
const createTour = async (req, res) => {
  //Alternative method
  // const newTour = new Tours({
  //   ...data
  // })
  // newTour.save().then(data => ...setOfCode)

  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err
    })
  }

};

//To get a single tour data using the specific ID
const getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: "Success",
      data: {
        tour
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: "Failure",
      message: err
    })
  }
  /*-------OLD SET OF CODE--------- */
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tour,
  //   },
  // });
  /*-------OLD SET OF CODE--------- */


};

//To update a specific tour data
const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //This returns the newly updated data
      runValidator: true
    })
    res.status(200).json({
      status: "Success",
      data: {
        tour: updatedTour
      }
    });
  }
  catch (err) {
    res.status(400).json({
      status: "Failure",
      message: err
    })
  }

};

//To delete a tour data 
const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "Success",
      data: null
    })
  }
  catch (err) {
    res.status(400).json({
      status: "Failure",
      message: err
    })
  }

};

const getTourStat = async(req,res) => {
  try{
    const stat = await Tour.aggregate([
      {$group : {
        _id : {$toUpper : `$difficulty`},
        totalTours : {$sum : 1},
        totalRatings : {$sum : '$ratingsQuantity'},
        avgRating : {$avg : '$ratingsAverage'},
        avgPrice : {$avg : '$price'}, 
        minPrice : {$min : '$price'},
        maxPrice : {$max : '$price'}
      }},
      {
        $sort : {
          avgPrice : 1
        }
      },
      {
        $match : {_id : "EASY"}
      }
    ]);
    res.status(200).json({
      status: "Success",
      data: stat
    })
  }
  catch(err){
    res.status(404).json({
      status : "Failure",
      message : err
    })
  }
}

const getMonthlyPlan = async(req, res) => {
  try{
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
      {
        $unwind : `$startDates` //Seperate the array fiedls like having each data for each array elements
      },
      {$match : {startDates : {$gte : new Date(`${year}-01-01 `), $lte : new Date(`${year}-12-31`)}}}, //Matches the dates that comes after jan 1 2021 and dec 31 2021
      {$group : {
        _id : {$month : '$startDates'},//$month operator helps us to only get the month of a given date
        numOfTours : {$sum : 1}, // Adds the number of data that is returned
        tours : {$push : "$name"}, //Creates an array in which the tour name is pushed
      }},
      {
        $addFields : {month : '$_id'} //Creates a seperate field based on the exsisting field
      },
      {
        $project : {
          _id : 0, //Helps to display or hide a particular field
        }
      },
      {
        $sort : {numOfTours : -1} //Sort based on the num of tours
      },
      {
        $limit : 5 //Limits the number of data is returned
      }
      
    ])
    
    res.status(200).json({
      status : 'success',
      result : plan.length,
      data : {
        plan
      }
    })
  }
  catch(err){
    res.status(404).json({
      status : "Failure",
      message : err
    })
  }
}
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  aliasLongestTours,
  getTourStat,
  getMonthlyPlan
  // checkId,
  // checkBody
}