"use strict";

const User = require("./user.model");
const httpStatus = require('http-status');
const APIResponse = require('../../helpers/APIResponse');
const Utils = require('../../helpers/utils')
let JWTHelper = require('../../helpers/jwt.helper');
const imageService = require("../../helpers/image-service");

class UserController {

    //sign up user
    async signUp(req, res, next) {
        let body = req.body;
        try {
            if (req.files) {
                body.profile = req.files['profile'][0].path;
            }

            let model = new User(req.body);

            let response = await model.save();

            JWTHelper = require('../../helpers/jwt.helper');

            const token = JWTHelper.getJWTToken({
                id: response.id,
                email: response.email,
                department: response.department,
                type: 'user'
            });

            response = {
                ...JSON.parse(JSON.stringify(response)),
                token: token
            }

            return res.status(httpStatus.OK).json(new APIResponse(response, 'User added successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //login user
    async login(req, res, next) {
        let body = req.body;

        try {
            let response = await User.login(body.email, body.password);
            if (response) {
                JWTHelper = require('../../helpers/jwt.helper');

                const token = JWTHelper.getJWTToken({
                    id: response.id,
                    email: response.email,
                    department: response.department,
                    type: 'user'
                });

                response = {
                    ...JSON.parse(JSON.stringify(response)),
                    token: token
                }

                return res.status(httpStatus.OK).json(new APIResponse(response, 'Login successfully', httpStatus.OK));
            }
            return res.status(httpStatus.UNAUTHORIZED).json(new APIResponse({}, 'Authentication error', httpStatus.UNAUTHORIZED));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error authenticating user', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //user get by id
    async getById(req, res, next) {
        let id = req.params.id;

        try {
            let response = await User.findById(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'User fetched successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'User with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting user', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //get all user
    async getAll(req, res, next) {
        try {
            let response = await User.getAll();
            return res.status(httpStatus.OK)
                .json(new APIResponse(response, 'Users fetched successfully', httpStatus.OK));
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse({}, 'Error getting users', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }

    //update user 
    async update(req, res, next) {
        let body = req.body;
        try {

            if (req.files) {
                body.profile = req.files['profile'][0].path;
            }

            delete body.email;
            // delete body.password;
            const response = await User.update(body);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'User updated successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'User with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse(null, 'Error updating user', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    //delete user by id
    async delete(req, res, next) {
        let userId = req.params.id;
        try {
            let response = await User.delete(userId);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'User deleted successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'User with the specified ID does not exists', httpStatus.BAD_REQUEST));

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(new APIResponse(null, 'Error deleting user', httpStatus.INTERNAL_SERVER_ERROR, error));
        }
    }
}

var exports = (module.exports = new UserController());