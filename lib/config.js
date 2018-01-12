'use strict';


module.exports = {
  paypal: {
      businessEmail: process.env.PAYPAL_EMAIL,
      url: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
      currency: 'USD'
  },
  secret: process.env.SECRET,
  name: 'cart-session',
  db: {
      url: process.env.MONGODB_URL,
      sessions: 'sessions'
  },
  locale: {
      lang: 'en-US',
      currency: 'USD'
  }
};