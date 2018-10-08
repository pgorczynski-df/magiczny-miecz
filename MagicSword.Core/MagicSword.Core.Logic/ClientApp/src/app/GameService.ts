import { Services } from "@Common/infrastructure/Services";
import { CardDefinitionLoader } from "@Common/mechanics/loaders/CardDefinitionLoader";
import { Event as Ev } from "@Common/events/Event";
import { IResponseProcessor } from "@Common/events/IResponseProcessor";
import { GameProvider } from "@Common/repository/GameProvider";
import { EventDispatcher } from "@Common/events/EventDispatcher";
import { CommonSerializer } from "@Common/mechanics/CommonSerializer";
import { IGamesRepository } from "@Common/repository/IGamesRepository";
import { UserDto } from "@App/common/client/UserDto";
import { AuthService } from "@App/AuthService";
import { UserProvider } from "@App/UserProvider";

export class GameService {

    public userProvider = new UserProvider();

    private commonSerializer = new CommonSerializer();
    private gameProvider = new GameProvider(this.commonSerializer, services => this.repository);
    private eventDispatcher = new EventDispatcher(this.gameProvider, this.commonSerializer);

    constructor(private services: Services, private repository: IGamesRepository) {
    }

    public init(): Promise<any> {
        return this.loadResources();
    }

    public async handleEvent(responseProcessor: IResponseProcessor, event: Ev) {

        this.services.logger.debug("incoming event: %s", JSON.stringify(event));

        var token = event.token;
        if (!token) {
            responseProcessor.respondError("No token in request");
            return;
        }

        var services = this.createServices(token);

        var user: UserDto = await this.userProvider.getUser(services, token)
            .catch(e => {
                responseProcessor.respondError(e);
                return undefined;
            });

        if (user === undefined) {
            return;
        }

        if (user === null) {
            responseProcessor.respondError("User not found, probably token is invalid");
            return;
        }

        event.sourcePlayerId = user.id;
        event.token = null;
        this.eventDispatcher.process(services, responseProcessor, event, user);
    }

    public getGame(id: string) {
        return this.gameProvider.getGame(id);
    }

    public getGameDto(id: string) {
        return this.gameProvider.getDto(id);
    }

    public evictCache() {
        this.services.logger.info("Clearing game cache");
        this.gameProvider.evictCache();
    }

    private createServices(token: string): Services {
        var auth = new AuthService();
        auth.setToken(token);
        return new Services(auth);
    }

    private loadResources(): Promise<any> {
        var services = this.createServices(null);
        var cardLoader = new CardDefinitionLoader(services);
        return cardLoader.load().then(_ => {
            services.logger.info("Card definitions loaded successfully");
            return true;
        });
    }

}
