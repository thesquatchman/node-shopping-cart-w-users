const User = require('../models/user');
const securityController = require('../controllers/security');

exports.renderLogin = function(req, res) {
  const user = req.session.user || false;
  res.render('login', {
      pageTitle: 'Login',
      user: user,
      nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
  });
};

exports.userLogout = function(req, res) {
  req.session.user = false;
  res.render('login', {
      pageTitle: 'Login',
      user: false,
      nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
  });
};

exports.postLogin = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
          if (err) { return callback(err); }

          // Password did not match
          if (!isMatch) { return callback(null, false); }

          // Success
          req.session.user = user;
          res.render('login', {
              pageTitle: 'Login',
              user: user,
              nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
          });
      });
  });
};


exports.renderRegistration = function(req, res) {
  if (req.session.user) {
    res.redirect('/login');
  } else {
    res.render('register', {
      pageTitle: 'New User',
      user: false,
      nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
    });  
  }
  
};

exports.createUser = function(req, res) {

    var user = new User();

    // Set the product properties that came from the POST data
    user.email = req.body.email ;
    user.password = req.body.password;
    user.displayName = req.body.displayName;
    
    user.save(function(err) {

        if (err) {
            
          return  res.send(err);
        }
        req.session.user = user;
        res.render('login', {
            pageTitle: 'Login',
            user: user,
            nonce: securityController.md5(req.sessionID + req.headers['user-agent'])
        });
    });
};
