declare var process;

export class Settings {

    public get noSqlConnectionString() {
        return this.getEnv("NO_SQL_CONNECTION_STRING") || "mongodb://localhost:27017/game";
    }

    public get gameServerUrl() {
        return this.getEnv("GAME_SERVER_URL") || "http://localhost:3000";
    }

    public get guiServerUrl() {
        return this.getEnv("GUI_SERVER_URL") || "http://localhost:4200";
    }

    public get authServerUrl() {
        return this.getEnv("AUTH_SERVER_URL") || "http://localhost:53048/";
    }

    private getEnv(varName: string) {

        if (typeof process === "undefined" || typeof process.env === "undefined") {
            return null;
        }

        var val = process.env[varName];
        if (!val || (val as string).startsWith("$")) {
            return null;
        }
        return val;
    }

}
