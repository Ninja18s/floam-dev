import {
     Body,
     Controller,
     Get,
     Logger,
     Param,
     Post,
     Delete,
} from '@nestjs/common';
import { BankDetailService } from './bankDetail.service';
import { BankDetailDto } from './bankDetail.dto';
import { UserService } from '../users/user.service';
import { BankDetail } from './bankDetail.entity';

@Controller('bankDetails')
export class BankDetailController {
     private log: Logger = new Logger('BankDetailController');

     constructor(
          private readonly bankDetailService: BankDetailService,
          private userService: UserService
     ) { }

     @Post()
     async createBankDetail(
          @Body() bankDetailDto: BankDetailDto
     ): Promise<BankDetail> {
          try {
               let user = await this.userService.getUser(bankDetailDto.userId);
               const newBankDetailDto = await this.bankDetailService.createBankToken(
                    bankDetailDto,
                    user
               );
               const bankDetail = await this.bankDetailService.createEntry(
                    newBankDetailDto
               );
               return bankDetail;
          } catch (error) {
               throw error;
          }
     }

     @Get('/users/:userId')
     async getBankDetails(@Param('userId') userId: string) {
          this.log.log('[GET] bankDetail which belong to user');
          await this.userService.getUser(userId);
          const bankDetails = await this.bankDetailService.getBankDetailsByUser(
               userId
          );
          return bankDetails.reverse();
     }

     @Delete('/:id')
     async removeCardInfo(@Param('id') id: string) {
          this.log.log(`[DELETE][removeBankDetailInfo]`);
          await this.bankDetailService.deleteBankDetail(id);
          return 'entry Deleted.';
     }

     @Post(':id/update')
     updateBankDetail(
          @Param('id') id: string,
          @Body() bankDetailDto: BankDetailDto
     ): Promise<unknown> {
          this.log.log(`processing update...`);
          return this.bankDetailService.update(id, bankDetailDto);
     }
}
