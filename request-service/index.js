'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const request = require('request');

let msg = `-----BEGIN PGP MESSAGE-----
Version: Keybase OpenPGP v2.0.50
Comment: https://keybase.io/crypto

wYwDaDETuUWrtf0BA/0SHyST/CDfTKoJB8+9MliHAEe14dKLHwXRlxnnfBYNbNTu
kbALA9PZvKg4GQ6dwe3r2aHMHwbQ6qRT/8vwJo99pppsV1BkrCm1AK99V8+FSXgi
TH0/2gCRvuPnl6YvIUafJrpgGAoMDCZyXl2ZJFDRzATi3BHkNbITJLkXZtJniNLA
ewFHc36xDS5WtYVEDSTgEh9XoVWsE22LDPEBqj8fTU4GW7PecXQnga7xaipUX7As
itKdijU5rFTDq7uqRi3mWI3iygCYHl2AAwFCtGoT3C7z2zHXaM/FQ+t6aLuF1zqd
XRhbJyu1kxZI+K4qDgchbuOjyxW6vmBnaeMEKmqxEZDCaRRtopga1yKEe1EBcvWu
tRu6tSosJGLu8q+hoWfgV1jJH38pmDWzGJxPyCTRygFueMkgR1hVMriUyYU/sg+y
38DsJQTcU3bINjiD8IdeGHrvJwMrVhYdxo8E1KIxTRACxHd/c01sSxMpWB25v/hP
D/mXcGWNryT6z4OCD0rjOvHutZpEw0YKhlvSZ3V5RjH7B7nXOVywhzejcFoQ7N2/
gxIu56jw5dBIZk2pM0eHZv6BwXMk40s2q2jx2w==
=441h
-----END PGP MESSAGE-----`;

let payload = {
  "payload": msg
};

let options = {
  headers: {
    contentType: ''
  },
  url: 'https://127.0.0.1:3030/api/payment/tokenize',
  method: 'POST',
  body: payload,
  json: true
};

request(options, (err, response, body) => {
  console.log(body);
});

