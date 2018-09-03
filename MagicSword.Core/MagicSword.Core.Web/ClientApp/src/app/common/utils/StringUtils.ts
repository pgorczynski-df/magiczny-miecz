
export class StringUtils {

    public static slashify(s: string): string {
        return s.endsWith("/") ? s : s + "/";
    }

    public static format(s: string, ...args: string[]) {
        return s.replace(/{(\d+)}/g, (match, number) => typeof args[number] != 'undefined'
            ? args[number]
            : match);
    }

}
