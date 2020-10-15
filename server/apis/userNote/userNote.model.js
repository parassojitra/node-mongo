"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        note: { type: String, required: true },
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

Schema.statics.findByUser = function (userId) {
    return this.find({
        user: userId,
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


module.exports = mongoose.model("UserNote", Schema);
