import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query
} from "@nestjs/common";
import { UserService } from "../users/user.service";
import { UserBankDetail } from "./userBankDetail.entity";
import { UserBankDetailService } from "./userBankDetail.service";
import { UserBankDetailDto } from "./userBankDetails.dto";

@Controller('UserBankDetail')
export class UserBankDetailController {
    public constructor(
        private readonly userBankDetailService: UserBankDetailService,
        private userService: UserService
    ) { }

    @Post('/create')
    public async CreateBankdetail(
        @Body() userBankDetailDto: UserBankDetailDto
    ): Promise<UserBankDetail> {
        try {
            let user = await this.userService.getUser(userBankDetailDto.userId);
            const newBankDetail = await this.userBankDetailService.createUserBankDetails(
                userBankDetailDto
            )
            return newBankDetail
        } catch (error) {
            throw error;

        }
    };

    @Get('/get')
    async getBankDetails(
        @Query('userId') userId: string,
        // @Body() userId: string,

    ): Promise<unknown> {
        console.log(userId);

        return await this.userBankDetailService.getBankDetails(userId)
    }

    @Put('/editBankDetails/:id')
    async editBankDetails(
        @Body() userBankDetailDto: UserBankDetailDto,
        @Param('id') id: string
    ): Promise<unknown> {
        return await this.userBankDetailService.editBankDetails(
            userBankDetailDto,
            id
        )
    }

    @Delete('/delete/:id')
    async deleteBankDetail(
        @Param('id') id: string,
    ) {
        return await this.userBankDetailService.deleteBankDetails(id)
    }


}