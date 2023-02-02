const express = require('express');
const morgan = require('morgan');

const {singleTourRoutes, allTourRoutes} = require('./routes/tourRoutes');
const {allUserRoutes, singleUserRoutes} = require('./routes/userRoutes');

const app = express();

//To serve static files (default public)
app.use(express.static('./public'));

//To access the data coming from any form
app.use(express.json());

//Used only in development environment, gives the details about the current request in cmd
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Tours
app.use('/api/v1/tours', allTourRoutes);
app.use('/api/v1/tour', singleTourRoutes)

//Users
app.use('/api/v1/users', allUserRoutes);
app.use('/api/v1/user', singleUserRoutes);


module.exports = app;

