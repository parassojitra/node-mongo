"use strict";

const UserNote = require("./userNote.model");
const httpStatus = require('http-status');
const Utils = require('../../helpers/utils')
const APIResponse = require('../../helpers/APIResponse');

class UserNoteController {

    //add userNote
    async add(req, res, next) {
        let body = req.body;
        try {
            let model = new UserNote(body);
            model.user = req.user.id
            let response = await model.save();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'User note added successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user note', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //userNote get by id
    async getById(req, res, next) {
        let id = req.params.id;

        try {
            let response = await UserNote.findById(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'User note fetched successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'User note with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting user note', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //userNote get by user
    async getByUser(req, res, next) {

        try {
            let response = await UserNote.findByUser(req.user.id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'User note fetched successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting user note', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //get all userNote 
    async getAll(req, res, next) {
        try {
            let response = await UserNote.getAll();
            return res.status(httpStatus.OK)
                .json(new APIResponse(response, 'User notes fetched successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse({}, 'Error getting user notes', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //update userNote
    async update(req, res, next) {
        let body = req.body;
        try {
            const response = await UserNote.update(body);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'User note updated successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'User note with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse(null, 'Error updating user note', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    //delete userNote by id
    async delete(req, res, next) {
        let userId = req.params.id;
        try {
            let response = await UserNote.delete(userId);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'User note deleted successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'User note with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse(null, 'Error deleting user note', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }
}

var exports = (module.exports = new UserNoteController());