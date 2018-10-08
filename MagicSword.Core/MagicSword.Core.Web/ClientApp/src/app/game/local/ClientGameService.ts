import { Event } from "@Common/events/Event";
import { GameProvider } from "@Common/repository/GameProvider";
import { EventDispatcher } from "@Common/events/EventDispatcher";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";
import { LocalStorageGamesRepository } from "@Common/repository/LocalStorageGamesRepository";
import { UserDto } from "@Common/client/UserDto";
import { EventBusResponseProcessor } from "@App/game/local/EventBusResponseProcessor";
import { ClientServices } from "@App/ClientServices";

export class ClientGameService {

    private commonSerializer = new CommonSerializer();
    private gameProvider = new GameProvider(this.commonSerializer, services => new LocalStorageGamesRepository(services));
    private eventDispatcher = new EventDispatcher(this.gameProvider, this.commonSerializer);
    private responseProcessor = new EventBusResponseProcessor(this.services);

    constructor(private services: ClientServices) {
    }

    public handleEvent(event: Event) {
        var localPlayer = new UserDto();
        localPlayer.id = "1";
        localPlayer.nickname = "Samotny poszukiwacz";

        event.sourcePlayerId = localPlayer.id;
        this.eventDispatcher.process(this.services, this.responseProcessor, event, localPlayer);
    }



}
