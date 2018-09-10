declare var process;

export class Settings {

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
        if (process && process.env) {
            return process.env[varName];
        }
    }

}
