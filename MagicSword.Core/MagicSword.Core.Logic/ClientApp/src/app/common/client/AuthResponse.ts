import { UserDto } from "@App/common/client/UserDto";

export class AuthResponse {

    success: boolean;

    user: UserDto;

    error: string;
}
