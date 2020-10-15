const UserController = require('./user.controller');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');
const uploadImage = require('../../helpers/image-service');

router.post("/signup", uploadImage.fields([{ name: 'profile', maxCount: 1 }]), signUpValidate, UserController.signUp);

router.post("/login", loginValidate, UserController.login);

router.get("/", UserController.getAll);

router.get("/:id", IDparamRequiredValidation, UserController.getById);

router.put("/", uploadImage.fields([{ name: 'profile', maxCount: 1 }]), updateValidate, UserController.update);

router.delete("/:id", IDparamRequiredValidation, UserController.delete);

const signUpValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('email is required!')),
    firstName: Joi.string().required().error(new Error('firstName is required!')),
    lastName: Joi.string().required().error(new Error('lastName is required!')),
    gender: Joi.string().required().error(new Error('gender is required!')),
    birthDate: Joi.date().required().error(new Error('birthDate is required!')),
    phone: Joi.number().required().error(new Error('phone is required!')),
    password: Joi.string().required().error(new Error('password is required!'))
}).unknown();

const loginValidation = Joi.object().keys({
    email: Joi.string().required().error(new Error('email is required!')),
    password: Joi.string().required().error(new Error('password is required!'))
}).unknown();

const updateValidation = Joi.object().keys({
    _id: Joi.string().required().error(new Error('_id is required!'))
}).unknown();

function signUpValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), signUpValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function loginValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), loginValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function updateValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), updateValidation, (error, result) => {
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

function IDparamRequiredValidation(req, res, next) {
    if (req.params && req.params.hasOwnProperty('id')) {
        next();
    } else {
        return res.status(httpStatus.BAD_REQUEST)
            .json(new APIResponse(null, 'id param not found', httpStatus.BAD_REQUEST));
    }
}

module.exports = router;