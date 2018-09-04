import { Services } from "@App/Services";
import { AuthService } from "@App/AuthService";
import { CardDefinitionLoader } from "@App/common/mechanics/loaders/CardDefinitionLoader";
import { Event } from "@App/common/events/Event";
import { IResponseProcessor } from "@App/common/events/IResponseProcessor";
import { GameProvider } from "@App/common/repository/GameProvider";
import { EventDispatcher } from "@App/common/events/EventDispatcher";
import { CommonSerializer } from "@App/common/mechanics/CommonSerializer";
import { EventBusResponseProcessor } from "@App/game/local/EventBusResponseProcessor";
import { LocalStorageGamesRepository } from "@App/common/repository/LocalStorageGamesRepository";

export class ClientGameService {

    private commonSerializer = new CommonSerializer();
    private gameProvider = new GameProvider(this.commonSerializer, services => new LocalStorageGamesRepository(services));
    private eventDispatcher = new EventDispatcher(this.gameProvider, this.commonSerializer);
    private responseProcessor = new EventBusResponseProcessor(this.services);

    constructor(private services: Services) {
    }

    public handleEvent(event: Event) {
        event.sourcePlayerId = "1";
        this.eventDispatcher.process(this.services, this.responseProcessor, event);
    }



}
