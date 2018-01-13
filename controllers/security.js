'use strict';

const crypto = require('crypto');

exports.md5 = function(value) {
  if(!value) {
      return;
  }
  return crypto.createHash('md5').update(value).digest('hex');
}

exports.isValidNonce = function(value, req) {
  return (value === this.md5(req.sessionID + req.headers['user-agent']));
}