import { UserDto } from "@Common/client/UserDto";

export class AuthResponse {

    success: boolean;

    user: UserDto;

    error: string;
}
