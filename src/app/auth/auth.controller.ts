import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";
import { RegisterDTO } from "./dto/register.dto";
import { ApiTags } from "@nestjs/swagger";
import { ResetPasswordDTO } from "./dto/resetPassword.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController{
    constructor(
        private authService : AuthService
    ){

    }


    @Get('email')
    email(){
        return this.authService.sendEmail();
    }

    @Post('login')
    login(@Body() authDTO: AuthDTO){
        return this.authService.login(authDTO);
    }

    @Post('register')
    register(@Body() registerDTO: RegisterDTO){
        return this.authService.register(registerDTO);
    }

    @Post('login-google')
    loginGoogle(@Body('token') token:string){
        return this.authService.verifyGoogleIdToken(token)
    }

    @Post('change-password')
    change(@Body() authDTO: AuthDTO){
        return this.authService.changePassword(authDTO)
    }

    @Post('reset-password')
    reset(@Body() resetDTO: ResetPasswordDTO){
        return this.authService.resetPassword(resetDTO.email)
    }
    
}