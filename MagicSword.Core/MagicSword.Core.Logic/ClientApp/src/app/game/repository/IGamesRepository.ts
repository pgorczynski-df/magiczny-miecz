import { GameDto } from "../dto/GameDto";

export interface IGamesRepository {

    getMyGames(): Promise<any>;

    get(id: string): Promise<any>;

    //save(dto: GameDto);
}
