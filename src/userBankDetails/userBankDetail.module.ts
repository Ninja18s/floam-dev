import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../users/user.module";
import { UserBankDetailController } from "./userBankDetail.controller";
import { UserBankDetail } from "./userBankDetail.entity";
import { UserBankDetailService } from "./userBankDetail.service";


@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([UserBankDetail]),

    ],
    providers: [UserBankDetailService],
    controllers: [UserBankDetailController],
    exports: [UserBankDetailService]
})
export class UserBankDetailModule { }