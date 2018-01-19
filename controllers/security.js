'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.md5 = function(value) {
  if(!value) {
      return;
  }
  return crypto.createHash('md5').update(value).digest('hex');
}

exports.isValidNonce = function(value, req) {
  return (value === this.md5(req.sessionID + req.headers['user-agent']));
}

exports.postAuthenticate = function(req, res) {
	User.findOne({
    email: req.body.email
  }, function(err, user) {
  	if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
			user.verifyPassword(req.body.password, function(err, isMatch) {
          if (err) { return callback(err); }

          // Password did not match
          if (!isMatch) { 
              res.json({ success: false, message: 'Authentication failed. Password doesn\'t match.' });
          }

          const payload = {
			      admin: user.admin 
			    };

			    var token = jwt.sign(payload, req.app.locals.superSecret, {
	          expiresIn: 60 * 60 
	        });
          

          res.json({
	          success: true,
	          message: 'Keep on token!',
	          token: token
	        });  
      });

		}
  });
}

exports.authenticateToken = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, req.app.locals.superSecret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
}
