import { Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { User } from '../users/user.entity';
import 'dotenv/config';

const { STRIPE_SECRET_KEY } = process.env;
const stripeClient = new Stripe(STRIPE_SECRET_KEY, {
     apiVersion: '2020-08-27',
});
const log: Logger = new Logger('StripeClient');

export async function createUserInStripe(user: User): Promise<string> {
     const { location, email, firstName, lastName, phone } = user;

     // create customer in stripe
     const customerCreateParams: Stripe.CustomerCreateParams = {
          address: {
               city: location.city || null,
               country: 'US',
               line1: location.addressOne || null,
               line2: location.addressTwo || null,
               postal_code: location.zipCode || null,
               state: location.state || null,
          },
          email,
          name: `${firstName} ${lastName}`,
          phone,
     };

     try {
          const customer: Stripe.Customer = await stripeClient.customers.create(
               customerCreateParams
          );
          log.log(`[createUserInStripe] user successfully created!`);
          return customer.id;
     } catch (e) {
          // todo: @ade send email to ops
          log.error(
               `[createUserInStripe][error] Failed to create the customer.`
          );
          log.error(e);
     }
}

export { Stripe };
export default stripeClient;
