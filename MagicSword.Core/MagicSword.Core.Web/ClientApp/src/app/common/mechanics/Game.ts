import { World } from "@App/common/mechanics/World";
import { Player } from "@App/common/mechanics/Player";

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

    findActor(id: string) {
        for (var stack of this.world.cardStacks) {
            if (stack.id === id) {
                return stack;
            }
            var card = stack.drawnCards.find(a => a.id === id);
            if (card) {
                return card;
            }
            card = stack.cards.find(a => a.id === id);
            if (card) {
                return card;
            }
            card = stack.disposedCards.find(a => a.id === id);
            if (card) {
                return card;
            }
        }
        return undefined;
    }
}
