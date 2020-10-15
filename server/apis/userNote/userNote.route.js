const UserNoteController = require('./userNote.controller');
var router = require("express").Router();
const APIResponse = require('../../helpers/APIResponse');
const httpStatus = require('http-status');
const Joi = require('joi');

router.post("/", addValidate, UserNoteController.add);

router.get("/", UserNoteController.getAll);

router.get("/getByUser", UserNoteController.getByUser);

router.get("/:id", IDparamRequiredValidation, UserNoteController.getById);

router.put("/", updateValidate, UserNoteController.update);

router.delete("/:id", IDparamRequiredValidation, UserNoteController.delete);

const addValidation = Joi.object().keys({
    title: Joi.string().required().error(new Error('title is required!')),
    note: Joi.string().required().error(new Error('note is required!')),
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