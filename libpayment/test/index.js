'use strict';

var Payment = require('../src/Payments');
var expect = require('chai').expect;

var validCardNumber = '4012888888881881';
var invalidCardNumber = 'visa';
var fakeCardNumber = '4111111111111112';
var cardObject = {
  'card_number': '4242424242424242',
  'exp_month': '12',
  'exp_year': '2017',
  'cvv': '123',
  'currency': 'Rs',
  'name': 'Ziyad Parekh',
  'address_country': 'Pakistan',
  'address_city': 'optional',
  'address_line_1': 'optional',
  'address_line_2': 'optional',
  'address_state': 'optional',
  'address_postal_code': 'optional',
};

describe('Payment', () => {
  it('should return a constructor', () => {
    var payment = new Payment({ card: cardObject });
    expect(payment).to.be.ok;
    expect(payment).to.be.an.instanceof(Payment);
  });

  it('should tokenize a card', () => {
    var payment = new Payment({ card: cardObject });
    console.log(payment.tokenizeCard());
  });

  it('should present a card', () => {
    var payment = new Payment({ card: cardObject });
    payment.presentCard().then((card) => {
      console.log(card);
    })
    //console.log(payment.presentCard());
  });

  it('should validate a card number', () => {
    var payment = new Payment({ card: cardObject });
    expect(payment.validateNumber()).to.equal(true);
  });

  it('should return false for invalid card numbers', () => {
    var fakeCard = Object.assign({}, cardObject, {
      card_number: invalidCardNumber
    });
    var payment = new Payment({ card: fakeCard });
    expect(payment.validateNumber()).to.equal(false);
  });

  it('should validate incorrect months', () => {
    var fakeCard = Object.assign({}, cardObject, {
      exp_month: '123'
    });
    var payment = new Payment({ card: fakeCard });
    expect(payment.validateMonth()).to.equal(false);
  });

  it('should validate a complete card in one go', () => {
    var payment = new Payment({ card: cardObject });
    expect(payment.isCardValid()).to.equal(true);
  });

});