var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	gender: String,
	mobile: String,
	email: String,
	location: String
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);