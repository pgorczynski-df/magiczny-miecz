import { GameDto } from "../dto/GameDto";

export interface IGamesRepository {

    get(id: string): Promise<any>;

    //save(dto: GameDto);
}
