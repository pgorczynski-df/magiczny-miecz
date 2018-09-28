import { Event } from "@App/common/events/Event";
import { World } from "@App/common/mechanics/World";
import { Player } from "@App/common/mechanics/Player";
import { IActorBase } from "@App/common/mechanics/IActorBase";

export class Game {

    id: string;

    owner: Player;

    players: Player[] = [];

    outBoundEvents: Event[] = [];

    world = new World();

    init() {
        this.world.newGame();
    }

    findPlayer(id: string) {
        return this.players.find(p => p.id === id);
    }

    addPlayer(id: string, name: string): Player {
        var player = new Player();
        player.id = id;
        player.name = name;
        this.players.push(player);
        return player;
    }

    findActor(id: string): IActorBase {
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
