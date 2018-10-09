
export class GameVisibility {

    /**
     * Game is public and visible
     */
    public static readonly Public: string = "Public";

    /**
     * Game is open for joining but not visible
     */
    public static readonly Open: string = "Open";

    /**
     * Game is closed - no new players can join
     */
    public static readonly Closed: string = "Closed";

    public static readonly all = [
        GameVisibility.Public,
        GameVisibility.Open,
        GameVisibility.Closed
    ];
}

