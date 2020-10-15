const MP3Controller = require('./mp3.controller');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');
const uploadImage = require('../../helpers/image-service');
// var multer = require("multer");
// var upload = multer({ dest: "files/" });

router.post("/", uploadImage.fields([{ name: 'image', maxCount: 1 }, { name: 'mp3', maxCount: 1 }]), addValidate, MP3Controller.add);

router.get("/", MP3Controller.getAll);

router.get("/getUserFavourite", MP3Controller.getUserFavourite);

router.get("/setFavourite/:id", MP3Controller.setFavourite);

router.get("/:id", IDparamRequiredValidation, MP3Controller.getById);

router.put("/", uploadImage.fields([{ name: 'image', maxCount: 1 }, { name: 'mp3', maxCount: 1 }]), updateValidate, MP3Controller.update);

router.delete("/:id", IDparamRequiredValidation, MP3Controller.delete);

const addValidation = Joi.object().keys({
    title: Joi.string().required().error(new Error('title is required!')),
    duration: Joi.string().required().error(new Error('duration is required!')),
    voiceType: Joi.string().required().error(new Error('voiceType is required!')),
}).unknown();

const updateValidation = Joi.object().keys({
    _id: Joi.string().required().error(new Error('_id is required!'))
}).unknown();

function addValidate(req, res, next) {
    const Data = req.body;
    Joi.validate((Data), addValidation, (error, result) => {
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