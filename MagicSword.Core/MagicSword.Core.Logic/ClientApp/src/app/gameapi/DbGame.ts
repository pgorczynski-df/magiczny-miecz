import { prop, Typegoose } from "typegoose";
import { IDbGame } from "@Common/repository/IDbGame";

export class DbGame extends Typegoose implements IDbGame {

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
