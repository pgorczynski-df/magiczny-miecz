import { World } from "@App/common/mechanics/World";
import { Player } from "@App/common/mechanics/Player";
import {IActorBase} from "@App/common/mechanics/IActorBase";

export class Game {

    id: string;

    owner: Player;

    players: Player[] = [];

    world = new World();

    constructor(owner: Player) {
        this.owner = owner;
        this.players.push(this.owner);
    }

    init() {
        this.world.newGame();
    }

    findActor(id: string) : IActorBase {
        for (var stack of this.world.cardStacks) {
            if (stack.id === id) {
                return stack;
            }
            var card = stack.findDrawnCard(id);
            if (card) {
                return card;
            }
            card = stack.findCard(id);
            if (card) {
                return card;
            }
            card = stack.findDisposedCard(id);
            if (card) {
                return card;
            }
        }
        return undefined;
    }
}
