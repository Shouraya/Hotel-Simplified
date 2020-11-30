const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      middleware = require("../middleware/index"),
      User = require("../models/user"),
      Hotel = require("../models/hotel"),
      async = require("async"),
      nodemailer = require("nodemailer"),
      crypto = require("crypto");
// SENDGRID
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//Landing Route
router.get("/", (req, res) => {
    res.render("landing");
});

// =================
//    AUTH ROUTES
// =================

// SHOW register form
router.get("/register",function(req, res){
    res.render("register", {page: 'register'});
});

//Handles Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        description: req.body.description
    });
    // eval(require('locus')); //stop the code for a few seconds and look at it
    if(req.body.adminCode === process.env.SECRETCODE) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            // req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Hotel Simplified " + user.username);
            res.redirect("/hotels");
        })
    });
});

//SHOW LOGIN FORM 
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

//Handle Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/hotels",
        failureRedirect: "/login"
    }), function(req, res){  
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out !");
    res.redirect("/hotels");
});

//FORGOT PASSWORD ROUTE
router.get('/forgot', function(req, res) {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash("error", 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in ms
                                                          //link becomes invalid after an hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shourayagoyal2000@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'shourayagoyal2000@gmail.com',
        subject: 'Hotel-Simplified Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      //Sending Mail
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

//REST - Token
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res){
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        //BOTH PASSWORD MATCH OR NOT
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    //SENDING MAIL AGAIN TO SHOW THAT YOUR PWD HAS BEEN RESET SUCCESSFULLY
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shourayagoyal2000@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'shourayagoyal2000@gmail.com',
        subject: 'Password Reset Successful !',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Your password has been changed, successfully !');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/hotels');
  });
});

// USER PROFILE 
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong !");
            return res.redirect("/");
        } else {
            Hotel.find().where('author.id').equals(foundUser._id).exec(function(err, hotels){
                if(err) {
                    req.flash("error", "Something went wrong !");
                    return res.redirect("/");
                } 
                res.render("users/show", {user: foundUser, hotels, hotels});
            })
            
        }
    });
});

//GET /contact
router.get('/contact', middleware.isLoggedIn, (req, res) => {
  res.render('contact');
}); 

//post /contact
router.post('/contact', async (req, res) => {
  let { name, email, message } = req.body
  name = req.sanitize(name);
  email = req.sanitize(email);
  message = req.sanitize(message);
  // lconst sanitizedString = req.sanitize(req.body);
  const msg = {
    to: 'shourayagoyal2000@gmail.com',
    from: email, // Use the email address or domain you verified above
    subject: `Hotel Simplified Contact Form from ${name}`,
    text: message,
    html: message,
  };
  try {
    // throw new Error('something went wrong!');
    await sgMail.send(msg);
    req.flash('success', 'Thank you for your email, we will get back to you shortly.');
    res.redirect("/hotels");
  } catch (error) {
    console.error(error);
 
    if (error.response) {
      console.error(error.response.body)
    }
    req.flash('error', 'Sorry, something went wrong, Please try again later');
    res.redirect('back');
  }
});

module.exports = router;