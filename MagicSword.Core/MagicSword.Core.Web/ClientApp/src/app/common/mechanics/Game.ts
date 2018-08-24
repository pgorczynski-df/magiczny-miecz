import { World } from "@App/common/mechanics/World";
import { Player } from "@App/common/mechanics/Player";
import { Services } from "@App/Services";

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
}
