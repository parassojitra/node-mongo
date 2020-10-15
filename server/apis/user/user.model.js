"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Utils = require('../../helpers/utils');


var GenderType = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other"
})

var Schema = new Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        firstName: { type: String, required: true, set: Utils.capitalize },
        lastName: { type: String, required: true, set: Utils.capitalize },
        gender: { type: GenderType, default: GenderType.MALE },
        birthDate: { type: Date, required: true },
        phone: { type: Number, required: true },
        profile: { type: String },
        password: { type: String, required: true, select: false, set: Utils.encrypt },
        peerSupport: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);



Schema.statics.login = function (email, password) {
    return this.findOne({
        email: email,
        password: password,
        isActive: true
    }).exec();
};

Schema.statics.getAll = function () {
    return this.find({ isActive: true })
        .populate("department", ['_id', 'email'])
        .sort({ createdAt: -1 }).exec();
};

Schema.statics.findById = function (id) {
    return this.findOne({ _id: id, isActive: true })
};

Schema.statics.update = function (data) {
    return this.findOneAndUpdate({
        _id: data._id,
    }, {
        $set: data
    },
        { new: true } // returns updated record
    );
};

Schema.statics.delete = function (id) {
    return this.findOneAndUpdate({
        _id: id,
        isActive: { $ne: false }
    }, {
        $set: { isActive: false }
    },
        { new: true } // returns updated record
    );
};

module.exports = mongoose.model("User", Schema);
