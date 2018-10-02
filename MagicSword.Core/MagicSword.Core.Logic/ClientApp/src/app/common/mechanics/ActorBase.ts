import { Object3D } from "@Common/mechanics/Object3D";
import { IActorBase } from "@Common/mechanics/IActorBase";
import { Guid } from "@Common/utils/Guid";

export class ActorBase implements IActorBase {

    id: string;

    object3D = new Object3D();

    name: string;

    constructor() {
        this.id = Guid.uuidv4();
    }
}
