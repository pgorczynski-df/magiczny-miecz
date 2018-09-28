import { Services } from "@App/Services";
import { Event } from "@App/common/events/Event";
import { GameProvider } from "@App/common/repository/GameProvider";
import { EventDispatcher } from "@App/common/events/EventDispatcher";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";
import { EventBusResponseProcessor } from "@App/game/local/EventBusResponseProcessor";
import { LocalStorageGamesRepository } from "@App/common/repository/LocalStorageGamesRepository";
import { UserDto } from "@App/common/client/UserDto";

export class ClientGameService {

    private commonSerializer = new CommonSerializer();
    private gameProvider = new GameProvider(this.commonSerializer, services => new LocalStorageGamesRepository(services));
    private eventDispatcher = new EventDispatcher(this.gameProvider, this.commonSerializer);
    private responseProcessor = new EventBusResponseProcessor(this.services);

    constructor(private services: Services) {
    }

    public handleEvent(event: Event) {
        var localPlayer = new UserDto();
        localPlayer.id = "1";
        localPlayer.nickname = "Samotny poszukiwacz";

        event.sourcePlayerId = localPlayer.id;
        this.eventDispatcher.process(this.services, this.responseProcessor, event, localPlayer);
    }



}
