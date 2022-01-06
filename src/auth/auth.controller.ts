import { Body, Controller, Param, Post } from '@nestjs/common';
import { User, USER_STATUS } from '../users/user.entity';
import { UserRegistrationDto } from '../users/user.registration.dto';
import { UserService } from '../users/user.service';
import { AuthResponseDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
     constructor(
          private userService: UserService,
          private authService: AuthService
     ) {}

     @Post('login')
     async login(@Body() dto: LoginDTO): Promise<AuthResponseDTO> {
          const token = await this.authService.signPayload(dto);
          const user = await this.userService.getByLoginInfo(
               dto.email,
               dto.password
          );

          return { user, token };
     }

     @Post('/register')
     async registerUser(
          @Body() registration: UserRegistrationDto
     ): Promise<AuthResponseDTO> {
          console.log('Register function called');
          const user: User = {
               ...registration,
               email: registration.email.toLowerCase(),
          };
          const userList = await this.userService.getAll();
          const existingUser = userList.find((u) => {
               return u.email === user.email;
          });

          if (existingUser === undefined) {
               console.log('register error');
               return { user: existingUser, token: existingUser.pushToken };
          }

          const createdUser = await this.userService.registerUser(user);

          const token = await this.authService.signPayload({
               email: createdUser.email,
               password: createdUser.password,
          });
          return { user: createdUser, token };
     }

     @Post('/v2/register/:userId')
     async v2RegisterUser(
          @Param('userId') userId: string
     ): Promise<AuthResponseDTO> {
          console.log('Register V2 function called');
          const user: User = await this.userService.getUser(userId);
          user.status = USER_STATUS.ACTIVE;
          // let customAccount = await this.userService.createCustomAccountForUser(
          //      user
          // );
          // user.customerId = customAccount.id;
          const updatedUser = await this.userService.createOrUpdateUser(user);
          const token = await this.authService.signPayload({
               email: updatedUser.email,
               password: updatedUser.password,
          });
          return { user: updatedUser, token };
     }

     @Post('/register/social')
     async registerSocialUser(
          @Body() registration: UserRegistrationDto
     ): Promise<AuthResponseDTO> {
          console.log('Register Social function called');
          if (registration.loginType == 'facebook') {
               const user: User = {
                    ...registration,
                    facebookId: registration.facebookId,
               };
               const userList = await this.userService.getAll();
               const existingUser = userList.find((u) => {
                    return u.facebookId === user.facebookId;
               });

               if (existingUser === undefined) {
                    // let customAccount = await this.userService.createCustomAccountForUser(
                    //      user
                    // );
                    // user.customerId = customAccount.id;
                    const createdUser = await this.userService.registerSocialUser(
                         user
                    );

                    const token = await this.authService.signFacebookPayload({
                         facebookId: createdUser.facebookId,
                         loginType: createdUser.loginType,
                    });
                    createdUser.isNewUser = true;
                    return { user: createdUser, token };
               } else if (existingUser !== undefined) {
                    console.log('existing user');

                    const token = await this.authService.signFacebookPayload({
                         facebookId: existingUser.facebookId,
                         loginType: existingUser.loginType,
                    });
                    existingUser.isNewUser = false;
                    return { user: existingUser, token: token };
               }
          } else if (registration.loginType == 'google') {
               const user: User = {
                    ...registration,
                    googleId: registration.googleId,
               };
               const userList = await this.userService.getAll();
               const existingUser = userList.find((u) => {
                    return u.googleId === user.googleId;
               });
               if (existingUser === undefined) {
                    // let customAccount = await this.userService.createCustomAccountForUser(
                    //      user
                    // );
                    // user.customerId = customAccount.id;
                    const createdUser = await this.userService.registerSocialUser(
                         user
                    );

                    const token = await this.authService.signGooglePayload({
                         googleId: createdUser.googleId,
                         loginType: createdUser.loginType,
                    });
                    console.log(createdUser);
                    createdUser.isNewUser = true;
                    return { user: createdUser, token };
               } else if (existingUser !== undefined) {
                    console.log('existing user');

                    const token = await this.authService.signGooglePayload({
                         googleId: existingUser.googleId,
                         loginType: existingUser.loginType,
                    });
                    existingUser.isNewUser = false;
                    return { user: existingUser, token: token };
               }
          } else if (registration.loginType == 'apple') {
               const user: User = {
                    ...registration,
                    appleId: registration.appleId,
               };
               const userList = await this.userService.getAll();
               const existingUser = userList.find((u) => {
                    return u.appleId === user.appleId;
               });
               if (existingUser === undefined) {
                    // let customAccount = await this.userService.createCustomAccountForUser(
                    //      user
                    // );
                    // user.customerId = customAccount.id;
                    const createdUser = await this.userService.registerSocialUser(
                         user
                    );

                    const token = await this.authService.signApplePayload({
                         appleId: createdUser.appleId,
                         loginType: createdUser.loginType,
                    });
                    console.log(createdUser);
                    createdUser.isNewUser = true;
                    return { user: createdUser, token };
               } else if (existingUser !== undefined) {
                    console.log('existing user');

                    const token = await this.authService.signApplePayload({
                         appleId: existingUser.appleId,
                         loginType: existingUser.loginType,
                    });
                    existingUser.isNewUser = false;
                    return { user: existingUser, token: token };
               }
          }
     }
}
