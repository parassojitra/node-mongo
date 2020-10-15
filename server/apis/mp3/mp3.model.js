"use strict";
var mongoose = require("mongoose");
const { string } = require("joi");
var Schema = mongoose.Schema;

var VoiceTypeEnum = Object.freeze({
    MALE: "male",
    FEMALE: "male"
});

var Schema = new Schema(
    {
        image: { type: String, required: true },
        title: { type: String, required: true },
        duration: { type: String, required: true },
        voiceType: { type: VoiceTypeEnum, default: VoiceTypeEnum.MALE },
        mp3: { type: String, required: true },
        favouriteBy: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }]
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

Schema.statics.getAll = function () {
    return this.find({ isActive: true }).sort({ createdAt: -1 }).exec();
};

Schema.statics.findById = function (id) {
    return this.findOne({ _id: id, isActive: true }).exec();
};

Schema.statics.findUserFavourite = function (userId) {
    return this.find({
        favouriteBy: {
            $in: [userId]
        },
        isActive: true
    })
        .sort({ createdAt: -1 })
        .exec();
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


module.exports = mongoose.model("Mp3", Schema);
