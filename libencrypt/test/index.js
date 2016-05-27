"use strict";

var expect = require('chai').expect;
var Encryptor = require('../index');
var config = {
  passphrase: new Buffer('so long and thanks for all the fish', "utf8"),
  privKeyPath: './keys/privatekey.txt',
  pubKeyPath: './keys/publickey.txt'
};

var partial_config = {
  pubKeyPath: './keys/publickey.txt'
};

var payment_config = {
  passphrase: new Buffer('this is for the payment service', "utf8"),
  privKeyPath: './keys/payment_private.txt',
  pubKeyPath: './keys/payment_public.txt'
};

var partial_payment_config = {
  pubKeyPath: './keys/payment_public.txt'
};

var msg = `-----BEGIN PGP MESSAGE-----
Version: Keybase OpenPGP v2.0.50
Comment: https://keybase.io/crypto

yMAXAnicO8LLzMDFOPfTypkJGn+1GU/LlzKEHao6EpKRWaxQnpmTo5CUqpCoUJyZ
npeaopBbnH5oDgsDIxcDGysTSBkDF6cATK/1Leb/CXKdwaImxnt0N53btImboYM5
JVGhOmXFtCmvI3fF72PvVcuR4Hldr9px5hL7mf/lfxQX7ZzY0PlL22/u7s6Gpi11
MuJxbOdXdtatXKp5s9/s+yR+md9xgdPP85yYo/PV75bC3R2msVMebMveqsvEyx/z
NkCrYdtVy7dLFF4+bo/Te74oS94VAIgNWbk=
=gEI+
-----END PGP MESSAGE-----`;

var msg2 = `-----BEGIN PGP MESSAGE----- \nVersion: Keybase OpenPGP v2.0.50 \nComment: https://keybase.io/crypto  \n\nwYwDaDETuUWrtf0BA/0R46AaIUH8MfAlFQxzQUhcugU2jzazB2lmdVMmfL0SP4LC \nArI7C7UmKZ1XirDwkXA5xq5ChDcq9TygFXZ3YAOnrkGn5jDa+foPwctE7vAWQD3A \nAHm2SO+BKdQyk93mqPgiQe4U+6uWQ4qz104yZn/WHguD3Zo9JmgQqzC9l9slH9LA \newHm8nMFEjZlqISAyxqAuXfacQ3eyB5QqGvz+Ee9pihVG4apfmbB3sdawv+3dPFz \nFwwcvhN+ogBd95EhlgrbwgPsgQ/6NazY18Tyc5qSsbavwe3Cj+g+7jl1rRRUVq46 \nzebYcriIKqJK0pa4iVFeH2y1xHulpPkDeZBEA2aEbfhlIkSjWBLpnOJzMaobV6Zu \nywQCWsBeIvjuSIfxLMjflWafuuHS6x1m4y1kX133Rz5DjxkxYD1DNXYiISfnUPjM \nXHY3ZaomlqJbihECA9lSCpTmWxDbkrkacPTkcLDAuXK4xjNcDz/YfF4dYxAxdwlP \nVRGrbXwK3M+Hb4D+g4Kfd6nJsK/oYw+YGeh8LDk74dVlcV9Gj+UynsnNTSC1xtaw \nj8YTaOZicmB20e4x4zMEBVQxZC4Zyjzczgx1tg== \n=135G \n-----END PGP MESSAGE-----`;

var msg3 = `-----BEGIN PGP MESSAGE----- \nVersion: Keybase OpenPGP v2.0.50 \nComment: https://keybase.io/crypto \n\nwYwDnfKpmWAo/SsBA/4grbMKozYn6xPnHBBQV9HZzwf7UwILm16DCmb1PBOR2fMi \ntkusoj3IlordmaJzpfMGgD1Hrynw45iQvDRU7dTboXm3phtjegb6dQkB85WouSnf \nnqSFRaRkPzZYEmHieHFw0e1EAvy/64OS7AdtFxfZQ13510ndV4mzju5tHTI0bNLA \newGorRLHmg5c4dDMO6pp9W8FSny/+9AwAK5utC+5YVrZREAWHP0jn4ZQGtR3BaWw \naZi3MGd5Pv7mwWzrBQLQ5rGlVVgkA6ihjYQq7dyVMT0p7XANq4qg99UMh3MdGjRb \ndI9yCbuSdWzPtEQC/8UIoSF89tAt9T+j8UjHniSXx+B7wig9t3YAbN5UG5SBipwi \nqm5SZ5RMOV3Byon3nDLSVg+FY5dxhfyxqyEXUArE2hZrj9CTRVmd+OsNyIXy5LlA \npC6Awq1BkgQ7yHtfhJ+4CylkFjscTUDQ+daT/SgdgA+oOlixDWsL5Ao4G1L6c+Nt \nV6bTf61TlvPgboaZ2Go71QRqXfaSW93vmOuUZI1+1+QBaeTMwGw9RK27rWrxyvmR \nbAuaEQNRmQexjNXThdC4KZjSHgGHP5mcSqqQMA== \n=tCCD \n-----END PGP MESSAGE-----`;

var transMsg = `-----BEGIN PGP MESSAGE----- \nVersion: Keybase OpenPGP v2.0.50 \nComment: https://keybase.io/crypto \n \nwYwDnfKpmWAo/SsBA/wL8i+bmygcv/9yJSSqu8vqsWOuqAiyh274IiD33SFaXxou \nK8B0EpoFQtBQI6XR9ulaTZDwg4m9oXtsJEFB15IgaSxBm4PT2wpE98SdD4tv7DRl \nHsrpp/USTmzeIAjvW+C298QS5Aj8kkQb/yXtoXsVVfssnK1Q5AHvhbPq7IZBMdLA \ngQFfFFedW+JlAVYiFsun3/Yar4v1hDCFX+qt3cD7Nw2Kr4zAyBmM+U4cqlDe9Q62 \nXp6bYA6yBTwWr7awJ2Vsd9rc5uo6CUown7jhqmJeUKMukgFjKBnUYTNFhJV0ZM1B \nlYI/Kg56EhEolpMmkvtUHdzhfJu2y+qMf9jGw8Fm6P8hPOOmFCqNL8xznho1mh/e \n7rlnXItBqU7anEBHp2JReESvowkZC73BwS8Ef67gUDRh0A86AgLz5Z0wn/f8EEQS \nEUeVz2tr2kwJLOFdd11gRg/EtzmKXweCXhturoRbl/4l2VO4Bx4L9T+cqTNcbqqk \ntpvOtTtnLeaQX9hBBk7xtqp25O0RESsDJVafxUJycu1jvyJcVK77KFgixjxtoDdu \nG/OCpBprkQqasBitTAourqjmkxUlQ/J86UhqfPL3ulcFpw== \n=w3cG \n-----END PGP MESSAGE-----`;

var card = {
  "payload": {
    "card_number": "4242424242424242",
    "exp_month": "12",
    "exp_year": "2017",
    "cvv": "123",
    "currency": "Rs"
  }
};

function newEncryptor(cfg) {
  return new Encryptor(cfg);
};

describe("Encryptor", function () {

  it("should initialize the encryptor", function () {
    var encryptor = new Encryptor(config);
    expect(encryptor).to.be.ok;
    expect(encryptor).to.be.an.instanceof(Encryptor);
  });

  it('should encrypt transaction details', (done) => {
    let payload = {
      token: "card_f737b0a5a6e581e3a92ff36acefb5925",
      objectId: "0RDq3f2FEV",
      amount: "250.25"
    };
    var payment = newEncryptor(partial_payment_config);
    var basic = newEncryptor(config);
    var basic_km;

    basic.loadKeyManager().then((km) => {
      return basic.unlockKeyManager(km);
    }).then((km) => {
      basic_km = km;
      return payment.loadKeyManager();
    }).then((pkm) => {
      let params = {
        msg: JSON.stringify(payload),
        encrypt_for: pkm,
        sign_with: basic_km
      }
      return basic.encrypt(params);
    }).then((encrypted) => {
      console.log("TRANSACTION:\n");
      console.log(encrypted);
      done();
    });
  });

  it('should fucking fuck', (done) => {
    var payment = newEncryptor(partial_payment_config);
    var basic = newEncryptor(config);
    var basic_km;

    basic.loadKeyManager().then((km) => {
      return basic.unlockKeyManager(km);
    }).then((km) => {
      basic_km = km;
      return payment.loadKeyManager();
    }).then((km) => {
      var params = {
        msg: JSON.stringify(card),
        encrypt_for: km,
        sign_with: basic_km
      }
      return basic.encrypt(params)
    }).then((encrypted) => {
      console.log(encrypted);
      done();
    });
  });

  it('should fuck fucking', (done) => {
    var payment = newEncryptor(payment_config);
    var basic = newEncryptor(partial_config);
    var payment_km;

    payment.loadKeyManager().then((km) => {
      return payment.unlockKeyManager(km);
    }).then((km) => {
      payment_km = km;
      return basic.loadKeyManager();
    }).then((km) => {
      return payment.decrypt(msg3, payment_km, km);
    }).then((decrypted) => {
      console.log(JSON.parse(decrypted));
      done();
    });
  });

  it('should go through the flow', (done) => {
    var payment = newEncryptor(payment_config);
    var payment_partial = newEncryptor(partial_payment_config);
    var basic = newEncryptor(config);
    var basic_partial = newEncryptor(partial_config);
    var payment_km;
    var basic_km;
    var encryptedMsg;
    var decryptedMsg;

    payment.loadKeyManager().then((km) => {
      return payment.unlockKeyManager(km);
    }).then((km) => {
      payment_km = km;
      return basic_partial.loadKeyManager();
    }).then((km) => {
      var params = {
        msg: "This will be a signed and encrypted msg",
        encrypt_for: km,
        sign_with: payment_km
      };
      return payment.encrypt(params);
    }).then((encrypted) => {
      console.log("Encrypted: ", encrypted);
      encryptedMsg = encrypted;
      return basic.loadKeyManager();
    }).then((km) => {
      return basic.unlockKeyManager(km);
    }).then((km) => {
      basic_km = km;
      return payment_partial.loadKeyManager();
    }).then((km) => {
      return basic.decrypt(encryptedMsg, basic_km, km);
    }).then((decrypted) => {
      console.log("Decrypted: ", decrypted);
      expect(decrypted).to.equal("This will be a signed and encrypted msg");
      done();
    }).catch((err) => {
      console.log(err);
      throw Error(err);
      done();
    });
  });

  it('should sign', (done) => {
    var payment = newEncryptor(payment_config);
    var payment_km;

    payment.loadKeyManager().then((km) => {
      return payment.unlockKeyManager(km);
    }).then((km) => {
      payment_km = km;
      var params = {
        msg: "This will be a signed msg",
        sign_with: payment_km
      }
      return payment.sign(params);
    }).then((signed) => {
      console.log(signed);
      expect(signed).to.be.ok
      done();
    }).catch((err) => {
      throw err;
      done();
    });
  });

  it('should verify', (done) => {
    var basic = newEncryptor(config);
    var payment = newEncryptor(partial_payment_config);
    var basic_km;

    basic.loadKeyManager().then((km) => {
      return basic.unlockKeyManager(km);
    }).then((km) => {
      basic_km = km;
      return payment.loadKeyManager();
    }).then((km) => {
      return basic.decrypt(msg, basic_km, km);
    }).then((decrypted) => {
      console.log(decrypted);
      expect(decrypted).to.equal("This will be a signed msg");
      done();
    }).catch((err) => {
      throw err;
      done();
    });

  });

  it('should encrypt', (done) => {
    var basic = newEncryptor(config);
    var payment = newEncryptor(payment_config);
    var payment_km;
    var basic_km;

    payment.loadKeyManager().then((km) => {
      return payment.unlockKeyManager(km);
    }).then((km) => {
      payment_km = km;
      return basic.loadKeyManager();
    }).then((km) => {
      return basic.unlockKeyManager(km);
    }).then((km) => {
      basic_km = km;
      var params = {
        msg: "This will be an encrypted msg",
        encrypt_for: payment_km,
        sign_with: basic_km
      }
      return basic.encrypt(params);
    }).then((encrypted) => {
      console.log(encrypted);
      expect(encrypted).to.be.ok;
      done();
    }).catch((err) => {
      throw err;
      done();
    });
  });

  it('should decrypt', (done) => {
    var basic = newEncryptor(config);
    var payment = newEncryptor(payment_config);
    var payment_km;
    var basic_km;

    payment.loadKeyManager().then((km) => {
      return payment.unlockKeyManager(km);
    }).then((km) => {
      payment_km = km;
      return basic.loadKeyManager();
    }).then((km) => {
      return basic.unlockKeyManager(km);
    }).then((km) => {
      basic_km = km;
      var params = {
        msg: "This will be an encrypted msg",
        encrypt_for: payment_km,
        sign_with: basic_km
      }
      return basic.encrypt(params);
    }).then((encrypted) => {
      return payment.decrypt(encrypted, payment_km, basic_km);
    }).then((decrypted) => {
      console.log(decrypted);
      expect(decrypted).to.equal("This will be an encrypted msg");
      done();
    }).catch((err) => {
      throw err;
      done();
    });
  })

});