import { double } from 'aws-sdk/clients/lightsail';

export class PayoutDto {
     totalAmount: string;
     floamAmount: double;
     studioUserAmount: double;
     userId: string;
     appointmentId: string;
     status: string;
     responseData: string;
     stripeUserPayoutId: string;
     amountSend: boolean;
}
