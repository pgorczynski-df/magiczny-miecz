import { GameListDto } from "@Common/dto/GameListDto";
import { UserDto } from "@Common/client/UserDto";
import { IDbGame } from "@Common/repository/IDbGame";

export interface IGamesRepository {

    getGame(id: string): Promise<IDbGame>;

    getUserGames(userId: string): Promise<GameListDto[]>;

    getPublicGames(): Promise<GameListDto[]>;

    updateGameData(id: string, dto: any): Promise<string>;

    createGame(owner: UserDto): Promise<GameListDto>;

    delete(id: string): Promise<string>;
}
