import { Game } from "@App/common/mechanics/Game";
import { DrawCardNotificationDto } from "@App/common/mechanics/events/DrawCardNotificationDto";

export class DrawCardEventHandler {

    get name() {
        return this.constructor.name;
    }

    execute(game: Game, args: any) {

        var eventResult = <DrawCardNotificationDto>args;

    }

}

