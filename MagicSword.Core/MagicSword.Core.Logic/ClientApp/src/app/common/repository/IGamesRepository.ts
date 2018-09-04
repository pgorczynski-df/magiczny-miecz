
export interface IGamesRepository {

    getMyGames(): Promise<any>;

    get(id: string): Promise<any>;

    update(id: string, dto: any): Promise<any>;
}
