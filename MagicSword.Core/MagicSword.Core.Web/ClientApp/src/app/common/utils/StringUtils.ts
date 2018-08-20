
export class StringUtils {

    public static slashify(s: string): string {
        return s.endsWith("/") ? s : s + "/";
    }

}