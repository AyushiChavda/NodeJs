const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest : 'public/images/' })
const {AddUser, loginUser, getCustomer, addCustomer, editCustomer, deleteCustomer} = require('../controllers/userController')
const { body } = require('express-validator');

router.post('/auth/register', upload.single('image'), body('name').notEmpty(), body('password').notEmpty(), body('password').isLength({ min: 8 }).withMessage('Min length 8'), body('email').notEmpty().isEmail(), body('phone').notEmpty(),  body('gender').notEmpty(), body('address').notEmpty(), AddUser);

router.post('/auth/login', body('username').notEmpty(), body('password').notEmpty(), loginUser);

router.get('/customers/:id?', getCustomer);

router.post('/customers/', upload.single('image'), body('name').notEmpty(), body('password').notEmpty(), body('password').isLength({ min: 8 }).withMessage('Min length 8'), body('email').notEmpty().isEmail(), body('phone').notEmpty(),  body('gender').notEmpty(), body('address').notEmpty(), addCustomer);

router.put('/customers/:id', upload.single('image'), body('name').notEmpty(), body('password').notEmpty(), body('password').isLength({ min: 8 }).withMessage('Min length 8'), body('email').notEmpty().isEmail(), body('phone').notEmpty(),  body('gender').notEmpty(), body('address').notEmpty(), editCustomer);

router.delete('/customers/:id', deleteCustomer);


module.exports = router;