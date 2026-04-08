export default {
  routes: [
    {
      method: 'POST',
      path: '/payments/initialize',
      handler: 'payment.initialize',
      config: {
        auth: false,
        policies: [],
        description: 'Initialize a Paystack payment (product purchase or booking deposit)',
      },
    },
    {
      method: 'GET',
      path: '/payments/verify',
      handler: 'payment.verify',
      config: {
        auth: false,
        policies: [],
        description: 'Verify a payment by reference after Paystack redirect',
      },
    },
    {
      method: 'POST',
      path: '/webhooks/paystack',
      handler: 'payment.webhook',
      config: {
        auth: false,
        policies: [],
        description: 'Paystack webhook receiver — do not call directly',
      },
    },
  ],
};
