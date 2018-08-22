import { Game } from "@App/common/mechanics/Game";

export class DrawCardEvent {

    get name() {
        return this.constructor.name;
    }

    //execute(game: Game, args: any) {
    //    var cardResult = game.world.drawCard(card, uncover);
    //    var stackDto = this.serializer.serializeCard(cardResult);
    //    return cardResult;
    //}

}
