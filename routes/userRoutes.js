const express = require('express');
const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

const allUserRoutes = express.Router();
const singleUserRoutes = express.Router();

allUserRoutes.route('/').get(getAllUsers).post(createUser);
singleUserRoutes.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = {
  allUserRoutes,
  singleUserRoutes
};
