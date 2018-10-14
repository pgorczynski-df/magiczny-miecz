import { Event } from "@Common/events/Event";
import { EventDispatcher } from "@Common/events/EventDispatcher";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";
import { LocalStorageGamesRepository } from "@Common/repository/LocalStorageGamesRepository";
import { UserDto } from "@Common/client/UserDto";
import { EventBusResponseProcessor } from "@App/game/local/EventBusResponseProcessor";
import { ClientServices } from "@App/ClientServices";
import { GameInitializer } from "@Common/model/GameInitializer";

export class ClientGameService {

    private commonSerializer = new CommonSerializer();
    private repository = new LocalStorageGamesRepository(this.services);
    private eventDispatcher = new EventDispatcher(this.repository, this.commonSerializer);
    private responseProcessor = new EventBusResponseProcessor(this.services);
    private gameInitializer = new GameInitializer(this.services, this.repository);

    constructor(private services: ClientServices, private owner: UserDto) {
    }

    public handleEvent(event: Event) {
        event.sourcePlayerId = this.owner.id;
        this.eventDispatcher.process(this.services, this.responseProcessor, event, this.owner);
    }

    async initGame(gameId: string) {
        var game = await this.repository.getGame(gameId);
        console.log(game);
        if (!game) {
            this.gameInitializer.initGame(gameId, this.owner);
        }
    }

}
