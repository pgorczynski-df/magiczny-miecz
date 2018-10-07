import * as mongoose from "mongoose";

export const GameSchema = new mongoose.Schema({

    ownerId: String,

    ownerName: String,

    data: Object,

    createdOn: Date,

    updatedOn: Date,

});
