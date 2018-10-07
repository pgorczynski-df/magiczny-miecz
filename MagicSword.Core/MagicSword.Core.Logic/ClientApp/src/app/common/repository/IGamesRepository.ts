import { GameListDto } from "@Common/dto/GameListDto";
import { UserDto } from "@Common/client/UserDto";

export interface IGamesRepository {

    getGame(id: string): Promise<any>;

    getUserGames(userId: string): Promise<GameListDto[]>;

    getOpenGames(): Promise<GameListDto[]>;

    update(id: string, dto: any): Promise<string>;

    save(owner: UserDto, dto: any): Promise<any>;

    createGame(owner: UserDto): Promise<GameListDto>;
}
