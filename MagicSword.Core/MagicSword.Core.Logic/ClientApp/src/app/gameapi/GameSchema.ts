import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({

    ownerId: String,

    data: Object

});
