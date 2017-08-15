var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var invitesSchema = new Schema(
	{
    userId: {
      type: String,
			required: true
    },
		location: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
    discussionTopic: {
			type: String,
			required: true
		},
    date: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true,
	}
);

var Invites = mongoose.model('Invites', invitesSchema);

module.exports = Invites;