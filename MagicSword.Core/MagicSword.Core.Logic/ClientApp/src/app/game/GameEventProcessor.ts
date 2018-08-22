import { Event } from "./Event";
import { EventType } from "./EventType";
import { IResponseProcessor } from "app/game/IResponseProcessor";
import { Services } from "../Services";
import { IGamesRepository } from "@App/common/repository/IGamesRepository";
import { GameStateDto } from "@App/common/dto/GameStateDto";

export class GameEventProcessor {

    constructor(private services: Services, private responseProcessor: IResponseProcessor, private gamesRepository: IGamesRepository) {

    }

    processRequest(event: Event) {


        switch (event.eventType) {
            case EventType.JoinGameRequest:

                this.responseProcessor.registerCaller(event);
                this.gamesRepository.get(event.gameId).then(gameDto => {

                    var gsDto: GameStateDto = {
                        currentPlayerId: event.sourcePlayerId,
                        data: gameDto,
                        isStarted: gameDto != null,
                    };

                    this.responseProcessor.respondCaller({
                        eventType: EventType.JoinGameResponse,
                        data: gsDto,
                        gameId: event.gameId
                    });

                    this.responseProcessor.respondAll(
                        {
                            gameId: event.gameId,
                            eventType: EventType.PlayerJoined,
                            data: {
                                id: event.sourcePlayerId,
                                name: event.sourcePlayerId,
                            }
                        });

                }, e => { this.services.logger.error(e); });


                break;

            //case EventType.GameLoadResponse:
            //    var data = ev.Data;
            //    var serialized = JsonConvert.SerializeObject(data);

            //    _logger.LogInformation("Updating game state from user {0}, length: {1}", playerId, serialized.Length);

            //    game.Data = serialized;
            //    await _context.SaveChangesAsync();
            //    break;
            //case EventType.ResetGameState:
            //    game.Data = ev.Data.ToString();
            //    await _context.SaveChangesAsync();
            //    break;
            //default:

            //    _logger.LogInformation("Requesting updated game state from caller id = {0}", playerId);
            //    await SendEvent(Clients.Caller, new Event
            //{
            //            GameId = game.Id,
            //            EventType = EventType.GameLoadRequest,
            //            Data = {},
            //            SourcePlayerId = -1,
            //        });

            //    var group = GetGameGroup(ev.GameId);

            //    _logger.LogInformation("Propagating event to group {0}", group);
            //    await SendEvent(Clients.Group(group), ev);
            //    break;

            default:
                this.services.logger.info("Propagating event to group");
                this.responseProcessor.respondAll(event);
                break;
        }
    }

}