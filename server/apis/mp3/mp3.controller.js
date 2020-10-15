"use strict";

const MP3 = require("./mp3.model");
const httpStatus = require('http-status');
const Utils = require('../../helpers/utils')
const APIResponse = require('../../helpers/APIResponse');
const imageService = require("../../helpers/image-service");

class MP3Controller {

    // add mp3
    async add(req, res, next) {
        let body = req.body;
        try {
            body.image = req.files['image'][0].path;
            body.mp3 = req.files['mp3'][0].path;

            let model = new MP3(body);
            let response = await model.save();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'MP3 added successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding MP3', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    // mp3 get by id
    async getById(req, res, next) {
        let id = req.params.id;

        try {
            let response = await MP3.findById(id);
            if (response) {
                response = JSON.parse(JSON.stringify(response));
                response['isFavourite'] = false;
                if (response.favouriteBy.find(user => user == req.user.id)) {
                    response['isFavourite'] = true;
                }

                return res.status(httpStatus.OK).json(new APIResponse(response, 'MP3 fetched successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'MP3 with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting MP3', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //get users favorites mp3
    async getUserFavourite(req, res, next) {

        try {
            let response = await MP3.findUserFavourite(req.user.id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'MP3 fetched successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'MP3 with the specified user does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting MP3', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //set user favourite mp3
    async setFavourite(req, res, next) {
        let id = req.params.id;

        try {
            let response = await MP3.findById(id);
            if (response) {
                if (response.favouriteBy.find(user => user == req.user.id)) {
                    let index;
                    response.favouriteBy.map((user, i) => {
                        if (user == req.user.id) {
                            index = i;
                        }
                    })

                    response.favouriteBy.splice(index, 1);
                } else {
                    response.favouriteBy.push(req.user.id)
                }

                response = await response.save();
                return res.status(httpStatus.OK).json(new APIResponse(response, 'MP3 added to favourite', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'MP3 with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error adding to favourite', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //get all mp3
    async getAll(req, res, next) {
        try {
            let response = await MP3.getAll();
            response = JSON.parse(JSON.stringify(response));

            response = response.map((mp3) => {
                mp3['isFavourite'] = false;
                if (mp3.favouriteBy.find(user => user == req.user.id)) {
                    mp3['isFavourite'] = true;
                }
                return mp3;
            })

            return res.status(httpStatus.OK)
                .json(new APIResponse(response, 'MP3s fetched successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse({}, 'Error getting MP3s', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //update mp3
    async update(req, res, next) {
        let body = req.body;
        try {

            if (req.files['image']) {
                body.image = req.files['image'][0].path;
            }

            if (req.files['mp3']) {
                body.mp3 = req.files['mp3'][0].path;
            }

            const response = await MP3.update(body);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'MP3 updated successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'MP3 with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse(null, 'Error updating MP3', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    //delete mp3 by id
    async delete(req, res, next) {
        let userId = req.params.id;
        try {
            let response = await MP3.delete(userId);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'MP3 deleted successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'MP3 with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse(null, 'Error deleting MP3', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }
}

var exports = (module.exports = new MP3Controller());