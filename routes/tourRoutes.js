const express = require('express');
const {
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
} = require('../controllers/tourControllers.js');

const allTourRoutes = express.Router();
const singleTourRoutes = express.Router();

//To display the aggregates
allTourRoutes.route("/tour-stat").get(getTourStat)
allTourRoutes.route("/monthly-plan/:year").get(getMonthlyPlan)

//To display the most best and cheapest tours
allTourRoutes.route("/top-5-cheap").get(aliasTopTours, getAllTours)

//To display the most longest tours that can be visited
allTourRoutes.route("/longest").get(aliasLongestTours, getAllTours)

allTourRoutes.route('/').get(getAllTours).post(createTour);
singleTourRoutes.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

module.exports = {
  allTourRoutes,
  singleTourRoutes
};
