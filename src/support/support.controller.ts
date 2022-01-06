import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { supportService } from './support.service'
import { supportDto } from './support.dto'
import { UserService } from '../users/user.service'
import { StudioService } from '../studio/studio.service'
import { Support } from './support.entity'
var nodemailer = require('nodemailer');

@Controller('contactSupports')
export class SupportController {
  private log: Logger = new Logger('supportController')

  constructor(
    private readonly supportService: supportService,
    private userService: UserService,
    private studioService: StudioService,
  ) { }

  @Post()
  async createSupport(@Body() supportDto: supportDto): Promise<Support> {
    const user = await this.userService.getUser(supportDto.userId);
    const support = await this.supportService.createSupport(supportDto)
    sendEmail('floamco1@gmail.com', user, support, null);
    return support
  }

  @Get()
  getAllSupports(): Promise<Support[]> {
    return this.supportService.getAll()
  }

  @Post('/chat/report') async createChatReport(
    @Body('userId') userId: string,
    @Body('toUserId') toUserId: string,
    @Body('text') text: string,
  ) {
    const user = await this.userService.getUser(userId);
    const toUser = await this.userService.getUser(toUserId);
    const support = {
      type: 'chat',
      text: text
    };
    sendEmail('floamco1@gmail.com', user, support, toUser);
    sendEmail('vishal@bcoder.in', user, support, toUser);
    return 'Report create has been created successfully'
  }

}

let sendEmail = async (email, user, support, toUser) => {
  let msg = null;
  if (support.type == 'report') {
    msg = `${user.firstName} ${user.lastName} (${user.email}) has reported for the following reason :<br></br>
    description: ${support.text}`;
  }
  else if (support.type == 'feedback') {
    msg = `${user.firstName} ${user.lastName} (${user.email}) has shared the feedback. Check out the feedback :<br></br>
    description: ${support.text}`;
  }
  else if (support.type == 'chat') {
    msg = `${user.firstName} ${user.lastName} (${user.email}) has report the chat with ${toUser.firstName} ${toUser.lastName} (${toUser.email}) for show selected reason. :<br></br>
    description: ${support.text}`;
  }
  let data = {
    to: email,
    subject: 'floam App',
    html: msg,
    from: '',
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'support@floam.co',
      pass: 'fmoowdfaheljnmsy'
    },
  });

  try {
    let info = await transporter.sendMail(data);
    console.log(info);
  } catch (err) {
    console.log(err);
  }
};
