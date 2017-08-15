
var express = require('express'),
	bodyParser = require('body-parser'),
	invitesRouter = express.Router(),
	mongoose = require('mongoose'),
	Invites = require('../models/invites'),
	Verify = require('./verify');

invitesRouter.route('/')
	.get(Verify.verifyOrdinaryUser, (req, res, next) => {
		Invites.find({}, (err, invite) => {
			if(err) res.json(err);
			res.json(invite);
		});
	})
  .post(Verify.verifyOrdinaryUser, (req, res, next) => {
		Invites.create(req.body, (err, invite) => {
			if(err) res.json(err);
			var id = invite._id;
			Invites.find({}, (err, invite) => {
        if(err) res.json(err);
				res.json(invite);
			});
		})
  })
  .put(Verify.verifyOrdinaryUser, (req, res, next) => {
    req.body.ids.map( (id) => {
      Invites.findByIdAndUpdate(id, { $set:
        {
          location : req.body.location,
          type : req.body.type,
          discussionTopic : req.body.discussionTopic,
          date : req.body.date
        }
      },
      {
        new:true
      }, (err, invite) => {
        if(err) res.json(err);
      });
    });

    Invites.find({}, (err, invite) => {
      if(err) res.json(err);
      res.json(invite);
    });
  })
  .delete(Verify.verifyOrdinaryUser, (req, res, next) => {
    Invites.remove({}, (err, resp) => {
      if(err) res.json(err);
      res.json(resp);
    });
  });

invitesRouter.route('/:inviteId')
	.get(Verify.verifyOrdinaryUser, (req, res, next) => {
		Invites.findById(req.params.inviteId, (err, invite) => {
			if(err) throw err;
			res.json(invite);
		});
	})
	.put(Verify.verifyOrdinaryUser, (req, res, next) => {
		Invites.findByIdAndUpdate(req.params.inviteId, {$set: req.body}, {
			new:true
		}, (err, invite) => {
			if(err) throw err;
			res.json(invite);
		});
	})
	.delete(Verify.verifyOrdinaryUser, (req, res, next) => {
		Invites.findByIdAndRemove(req.params.inviteId, (err, resp) => {
			if(err) throw err;
			Invites.find({}, (err, invite) => {
				if(err) throw err;
				res.json(invite);
			});
		});
  })



module.exports = invitesRouter;