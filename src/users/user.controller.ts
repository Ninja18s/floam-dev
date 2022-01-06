import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { forgotDTO } from 'src/auth/auth.dto';
import { AppointmentService } from '../appointment/appointment.service';
import { StudioService } from '../studio/studio.service';
import { SessionListDto } from './SessionListDto';
import { User } from './user.entity';
import { UserService } from './user.service';
var randomstring = require('randomstring');
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var nodemailer = require('nodemailer');
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
     private log: Logger = new Logger('UserController');

     constructor(
          private readonly appointmentService: AppointmentService,
          private readonly studioService: StudioService,
          private userService: UserService
     ) {}

     // // todo: @ade remove this
     // @Post('/payment-data-patch')
     // async tempDataPatch() {
     //   await this.userService.tempPaymentDataPatch()
     //   return 'Payments data has been patched'
     // }

     @Get(':id')
     getUser(@Param('id') userId: string): Promise<User> {
          return this.userService.getUser(userId);
     }

     @Get('/checkDuplication/:email')
     async checkDuplication(@Param('email') email: string) {
          const users = await this.userService.getAll();
          const foundUser = users.find((user) => {
               return user.email === email;
          });

          if (foundUser === undefined) {
               return {
                    result: 'NO',
               };
          }
          return {
               result: 'YES',
          };
     }

     @Get()
     getAllUser(): Promise<User[]> {
          return this.userService.getAll();
     }

     @Post()
     async updateUser(@Body() userInfo: User) {
          this.log.debug(`update user route`);
          // todo: add proper validation around this!
          if (userInfo.id) {
               if (userInfo.password) {
                    let bcryptPassword = await bcrypt.hash(
                         userInfo.password,
                         10
                    );
                    userInfo.password = bcryptPassword;
               }
          }
          let customAccount = await this.userService.createCustomAccountForUser(
               userInfo
          );
          userInfo.customerId = customAccount.id;
          return this.userService.createOrUpdateUser(userInfo);
     }

     @Get('/:id/sessions')
     async getUserSessions(@Param('id') userId): Promise<SessionListDto> {
          const user = await this.userService.getUser(userId);
          return this.appointmentService.getBookingsForUser(user);
     }

     @Post('/forgotPassword')
     async forgot(@Body() dto: forgotDTO): Promise<any> {
          const user = await this.userService.getUserFromEmail(dto.email);
          if (user) {
               let password = randomstring.generate(8).toUpperCase();
               sendPasswordToAdmin(user, password);
               let bcryptPassword = await bcrypt.hash(password, 10);
               user.password = bcryptPassword;
               await this.userService.createOrUpdateUser(user);
               return 'done';
          }
     }
}

let sendPasswordToAdmin = async (user, password) => {
     var templatePath = path.resolve('templates/floam.html');
     var template = fs.readFileSync(templatePath, 'utf8');
     let model = {
          firstName: user.firstName,
          lastName: user.lastName,
          password: password,
     };
     var html = mustache.render(template, model);
     let data = {
          to: user.email,
          subject: 'floam App',
          html: html,
          from: '',
     };

     let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
               user: 'support@floam.co',
               pass: 'fmoowdfaheljnmsy',
          },
     });

     try {
          let info = await transporter.sendMail(data);
          console.log(info);
     } catch (err) {
          console.log(err);
     }
};
