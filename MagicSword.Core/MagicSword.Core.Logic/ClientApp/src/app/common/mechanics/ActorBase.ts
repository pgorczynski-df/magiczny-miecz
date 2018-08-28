import {Object3D} from "@App/common/mechanics/Object3D";
import {IActorBase} from "@App/common/mechanics/IActorBase";
import {Guid} from "@App/common/utils/Guid";

export class ActorBase implements IActorBase {

    id: string;

    object3D = new Object3D();

    //selectable: boolean;

    //isSelected: boolean;

    //draggable: boolean;

    name: string;

    //faceUrl: string;

    constructor() {
        this.id = Guid.uuidv4();
    }
}
