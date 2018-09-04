import {GameListDto} from "@App/common/dto/GameListDto";

export interface IGamesRepository {

    getGame(id: string): Promise<any>;

    getMyGames(): Promise<GameListDto[]>;

    update(id: string, dto: any): Promise<string>;
}
