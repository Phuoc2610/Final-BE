import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";
import { RegisterDTO } from "./dto/register.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller('auth')
@ApiTags('Auth')
export class AuthController{
    constructor(
        private authService : AuthService
    ){

    }

    @Post('login')
    login(@Body() authDTO: AuthDTO){
        return this.authService.login(authDTO);
    }

    @Post('register')
    register(@Body() registerDTO: RegisterDTO){
        return this.authService.register(registerDTO);
    }
    
}