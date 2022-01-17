import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
const stripeTest = require('stripe')(
     'sk_test_51IpFtXBt3PovyCqB7tEHqxxsH6K3OgIqwm2A8TCfYCmk4RGR1GXIMzIKOf3PYdHXdlCgH99NjN1K7UqopENJSyPV00BAV1yJFD'
);
const stripeProd = require('stripe')('sk_test_MEvj1NP7uAlLRMMWukEMnzV5');
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { BankDetailDto } from './bankDetail.dto';
import { BankDetail } from './bankDetail.entity';

@Injectable()
export class BankDetailService {
     private log: Logger = new Logger('BankDetailService');

     constructor(
          @InjectRepository(BankDetail)
          private readonly BankDetailServiceRepo: Repository<BankDetail>
     ) { }

     async createEntry(stripeBankToken: BankDetailDto) {
          try {
               const {
                    name,
                    bankName,
                    routingNumber,
                    accountNumber,
                    userId,
                    bankToken,
                    bankAccountToken,
                    city,
                    state
               } = stripeBankToken;
               const bankDetail: BankDetail = {
                    name,
                    bankName,
                    routingNumber,
                    accountNumber,
                    userId,
                    bankToken,
                    bankAccountToken,
                    city,
                    state
               };
               return await this.BankDetailServiceRepo.save(bankDetail);
          } catch (err) {
               throw err;
          }
     }

     getBankDetailsByUser(userId: string) {
          return this.BankDetailServiceRepo.find({
               where: { userId },
          });
     }

     async deleteBankDetail(id: string) {
          const bankDetail = await this.BankDetailServiceRepo.findOne({
               where: { id: id },
          });
          if (!bankDetail) {
               return 'bankDetail not found';
          }
          await this.BankDetailServiceRepo.delete(bankDetail.id);
          return;
     }

     async update(id: string, bankDetailDto) {
          const {
               name,
               bankName,
               routingNumber,
               accountNumber,
               userId,
               bankToken,
               bankAccountToken,
               city,
               state
          } = bankDetailDto
          let bankDetail = await this.BankDetailServiceRepo.update(
               { id: id },
               {
                    name,
                    bankName,
                    routingNumber,
                    accountNumber,
                    userId,
                    bankToken,
                    bankAccountToken,
                    city,
                    state
               }
          );

          return bankDetail
     }

     async createBankToken(data, user): Promise<BankDetailDto> {
          try {
               const token = await stripeTest.tokens.create({
                    bank_account: {
                         country: 'US',
                         currency: 'usd',
                         account_holder_name: data.name,
                         account_holder_type: 'individual',
                         routing_number: data.routingNumber,
                         account_number: data.accountNumber,
                    },
               });
               if (token && token.id) {
                    let bankAccount = await stripeTest.accounts.createExternalAccount(
                         user.customerId,
                         { external_account: token.id }
                    );
                    if (bankAccount) {
                         data.bankToken = token.id;
                         data.bankAccountToken = bankAccount.id;
                         return data;
                    }
               }
          } catch (err) {
               throw err.message;
          }
     }

     async getEntry(userId: string) {
          let bankDetail = await this.BankDetailServiceRepo.findOne(userId);
          if (!bankDetail) {
               return 'not found';
          }
          return bankDetail;
     }
}
