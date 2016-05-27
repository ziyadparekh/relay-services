'use strict';

let valid = require('card-validator');
let crypto = require('crypto');
let cardTable = {
  'visa': '11',
  'mastercard': '12'
}

// Need to Store original card on this
// Use crypto bytes function to generate safe token

class Payment {
  constructor(args) {
    if (!args.card ||
        typeof args.card !== 'object')
    {
      throw Error('Card object required to validate');
    }
    this.card = Object.assign({}, args.card);
    delete args.card;
  }

  verifyCardFromBank(cardObject) {
    // TODO: Make request to Bank api
    // For now resolve empty Promise
    return Promise.resolve(cardObject);
  }

  isCardValid() {
    return (
      this.validateNumber() &&
      this.validateMonth() &&
      this.validateYear() &&
      this.validateCvv()
    );
  }

  presentCard() {
    return Promise.resolve().then(() => {
      let card = this.formatCard();
      let date = this.formatDate();
      return {
        cvv: card.cvv,
        number: card.number,
        token: this.tokenizeCard(),
        last_4: card.last_4,
        nice_type: card.niceType,
        exp_month: date.month,
        exp_year: date.year
      };
    });
  }

  tokenizeCard() {
    // card_UUID
    let token = this.newHexString(32);
    return "card_" + token;
  }

  // Returns a new random hex string suitable for secure tokens.
  newHexString(size) {
    if (size === 0) {
      throw new Error('Zero-length randomHexString is useless.');
    }
    if (size % 2 !== 0) {
      throw new Error('randomHexString size must be divisible by 2.')
    }
    return crypto.randomBytes(size/2).toString('hex');
  }

  formatCard() {
    let cardNumber = this.card.card_number;
    let cvv = this.card.cvv
    if (!cardNumber ||
        typeof cardNumber !== 'string')
    {
      throw Error('cardNumber must be a string');
    }
    let cardObject = valid.number(cardNumber);
    if (!cardObject)
      return;
    
    return Object.assign({}, cardObject.card, {
      cvv: cvv,
      number: cardNumber,
      last_4: cardNumber.substring(cardNumber.length - 4),
      checksum: cardNumber.substring(cardNumber.length - 1),
      type_number: cardTable[cardObject.card.type]
    });
  }

  validateNumber() {
    let cardNumber = this.card.card_number;
    if (!cardNumber ||
        typeof cardNumber !== 'string')
    {
      throw Error('cardNumber must be a string');
    }
    let resp = valid.number(cardNumber);
    return resp ? resp.isValid : false;
  }

  formatDate() {
    if (this.validateMonth() &&
        this.validateYear())
    {
      return valid.expirationDate(
        [this.card.exp_month, this.card.exp_year].join("/")
      );
    }
    return {};
  }

  validateMonth() {
    let cardMonth = this.card.exp_month;
    if (!cardMonth ||
        typeof cardMonth !== 'string')
    {
      throw Error('cardMonth must be a string');
    }
    let resp = valid.expirationMonth(cardMonth);
    return resp ? resp.isValid : false;
  }

  validateYear() {
    let cardYear = this.card.exp_year;
    if (!cardYear ||
        typeof cardYear !== 'string')
    {
      throw Error('cardYear must be a string');
    }
    let resp = valid.expirationYear(cardYear);
    return resp ? resp.isValid : false;
  }

  validateCvv() {
    let cardCvv = this.card.cvv;
    if (!cardCvv ||
        typeof cardCvv !== 'string')
    {
      throw Error('cardCvv must be a string');
    }
    let resp = valid.cvv(cardCvv);
    return resp ? resp.isValid : false;
  }
}

module.exports = Payment;