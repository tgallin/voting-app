'use strict';

var Poll = require('../models/polls.js');

function PollHandler() {

	this.getAllPolls = function(req, res) {
		Poll
			.find(function(err, polls) {
				if (err) {
					throw err;
				}
				res.json(polls);
			});
	};

	this.getMyPolls = function(req, res) {
		Poll
			.find({
				'user_id': req.user.id
			}, function(err, polls) {
				if (err) {
					throw err;
				}
				res.json(polls);
			});
	};

	this.getPoll = function(req, res) {
		Poll
			.findById(
				req.params.id,
				function(err, poll) {
					if (err) {
						throw err;
					}
					res.json(poll);
				});
	};

	this.addPoll = function(req, res, next) {

		var newPoll = new Poll();

		newPoll.user_id = req.user.id;
		newPoll.question = req.body.question;
		var i = 1;
		var optionName = 'option' + i;
		var options = [];
		var labels = [];
		var optionLabel = "";
		while (req.body[optionName]) {
			optionLabel = req.body[optionName];
			if (labels.indexOf(optionLabel.toLowerCase()) === -1) {
				var option = {
					label: optionLabel,
					voteCount: 0
				};
				options.push(option);
				labels.push(optionLabel.toLowerCase());
			}
			i++;
			optionName = 'option' + i;
		}
		newPoll.options = options;

		newPoll.save(function(err, poll) {
			if (err) {
				throw err;
			}
			req.pollId = poll._id;
			return next();
		});
	};

	this.addOption = function(req, res) {

		Poll
			.findOne({
				"_id": req.body.pollId,
				"options.label": req.body.newOption
			}, function(err, poll) {
				if (err) {
					throw err;
				}
				if (!poll) {
					Poll
						.findByIdAndUpdate(req.body.pollId, {
							$push: {
								"options": {
									label: req.body.newOption,
									voteCount: 0
								}
							}
						}, {
							new: true
						}, function(err, poll) {
							if (err) {
								throw err;
							}
							res.json(poll);
						});
				}
			});
	};

	this.vote = function(req, res) {
		Poll
			.findOneAndUpdate({
				"_id": req.body.pollId,
				"options._id": req.body.optionId
			}, {
				"$inc": {
					"options.$.voteCount": 1
				}
			}, {
				new: true
			}, function(err, poll) {
				if (err) {
					throw err;
				}
				res.json(poll);
			});
	};

	this.deletePoll = function(req, res) {
		Poll
			.findOneAndRemove({
				"_id": req.params.id,
				"user_id": req.user.id
			}, function(err, poll) {
				if (err) {
					throw err;
				}
				res.json(poll);
			});
	};

}

module.exports = PollHandler;
