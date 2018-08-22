import { Game } from "@App/common/mechanics/Game";
import {DrawCardResultDto} from "@App/common/mechanics/events/DrawCardResultDto";

export class DrawCardEventHandler {

    get name() {
        return this.constructor.name;
    }

    execute(game: Game, args: any) {

        var eventResult = <DrawCardResultDto> args;

    }

}

