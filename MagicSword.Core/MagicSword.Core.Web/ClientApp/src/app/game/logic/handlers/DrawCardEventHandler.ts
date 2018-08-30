import { Game } from "@App/common/mechanics/Game";
import { DrawCardNotificationDto } from "@App/common/events/drawcard/DrawCardNotificationDto";

export class DrawCardEventHandler {

    get name() {
        return this.constructor.name;
    }

    execute(game: Game, args: any) {

        var eventResult = <DrawCardNotificationDto>args;

    }

}

