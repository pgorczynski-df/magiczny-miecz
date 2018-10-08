import { prop, Typegoose } from "typegoose";

export class DbGame extends Typegoose {

    @prop()
    ownerId: string;

    @prop()
    ownerName: string;

    @prop()
    data: any;

    @prop()
    createdOn: Date;

    @prop()
    updatedOn: Date;

    @prop()
    visibility: string;
}
