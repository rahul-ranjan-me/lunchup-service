var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var config = require('../config')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res) => {
	console.log(req.body)
	User.register(new User(
		{
			username: req.body.username, 
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			gender: req.body.gender,
			mobile: req.body.mobile,
			email: req.body.email,
			location: req.body.location
		}
	),
		req.body.password, (err, user) => {
			if(err){
				return res.status(500).json({err:err});
			}

			passport.authenticate('local')(req, res, () => {
				return res.status(200).json({status: 'Registration Successful!'});
			});
	});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if(err){
			return next(err);
		}

		if(!user){
			return res.status(401).json({
				err:info
			});
		}

		req.logIn(user, (err) => {
			if(err){
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}

			var token = Verify.getToken(user);
			res.status(200).json({
				status: 'Login Successful!',
				success: true,
				token: token,
				id: user._id,
				userDetails: {
					id: user._id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					gender: user.gender,
					location: user.location,
					mobile: user.mobile,
					username: user.username
				}
			})
		})
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.status(200).json({
		status: 'Bye!'
	});
});

router.route('/:userId')
	.get(Verify.verifyOrdinaryUser, (req, res, next) => {
		User.findById(req.params.userId, (err, user) => {
			if(err) res.json(err);
			res.json(user);
		});
	})
	.put(Verify.verifyOrdinaryUser, (req, res, next) => {
		var toUpdate = {};
		for(var x in req.body){
			if(x){
				toUpdate[x] = req.body[x];
			}
		}
		
		User.findByIdAndUpdate(req.params.userId, { $set:
			toUpdate
		},
		{
			new:true
		}, (err, user) => {
			if(err) throw err;
			var dataToSend = {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				gender: user.gender,
				location: user.location,
				mobile: user.mobile,
				username: user.username
			}

			return res.status(200).json(dataToSend);
		
    });

	});

module.exports = router;