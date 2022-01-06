import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm';
import { UserBankDetailDto } from './userBankDetails.dto';
import { UserBankDetail } from './userBankDetail.entity';

@Injectable()
export class UserBankDetailService {
    private log: Logger = new Logger('UserBankDetailService');

    constructor(
        @InjectRepository(UserBankDetail)
        private readonly UserBankDetailServiceRepo: Repository<UserBankDetail>
    ) { }

    public async createUserBankDetails(
        body: UserBankDetailDto,
    ): Promise<UserBankDetail> {
        try {

            const bankDetails: UserBankDetail = {
                name: body.name,
                bankName: body.bankName,
                routingNumber: body.routingNumber,
                accountNumber: body.accountNumber,
                state: body.state,
                city: body.city,
                userId: body.userId,

            };
            return await this.UserBankDetailServiceRepo.save(bankDetails)
        } catch (error) {
            throw error;
        }
    }
    public async getBankDetails(
        userId: string
    ): Promise<unknown> {
        console.log(userId);
        const bankDetails = await this.UserBankDetailServiceRepo.find({ where: { userId: userId } });
        console.log(bankDetails);
        if (!bankDetails) {
            throw new Error("bank details not found");

        }
        return bankDetails
    }

    public async editBankDetails(
        body: UserBankDetailDto,
        id: string
    ): Promise<unknown> {
        try {

            const {
                name,
                bankName,
                accountNumber,
                routingNumber,
                state,
                city
            } = body;

            const details = await this.UserBankDetailServiceRepo.update(
                { id: id },
                {
                    name,
                    bankName,
                    accountNumber,
                    routingNumber,
                    state,
                    city
                }
            );
            return details

        } catch (error) {
            throw error;
        }
    }
    public async deleteBankDetails(
        id: string,
    ) {
        try {

            const getDetails = await this.UserBankDetailServiceRepo.find({ id: id });
            if (!getDetails) {
                throw new Error("bank details not found");

            }
            return await this.UserBankDetailServiceRepo.delete(id)

        } catch (error) {
            throw error;
        }
    }
}