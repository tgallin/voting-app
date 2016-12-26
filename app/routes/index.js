'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function(app, passport, urlencodedParser) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(function(req, res) {
			res.render('index', {
				loggedIn: req.isAuthenticated(),
				title: 'Voting app'
			});
		});

	app.route('/login')
		.get(function(req, res) {
			res.render('login', {
				loggedIn: req.isAuthenticated(),
				title: 'Voting app - login'
			});
		});

	app.route('/dashboard')
		.get(function(req, res) {
			res.render('dashboard', {
				loggedIn: req.isAuthenticated(),
				userId: req.user ? req.user.id : "",
				title: 'Voting app - dashboard'
			});
		});

	app.route('/polldetail/:id')
		.get(function(req, res) {
			res.render('polldetail', {
				loggedIn: req.isAuthenticated(),
				title: 'Voting app - poll detail',
				pollId: req.params.id
			});
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/dashboard',
			failureRedirect: '/login'
		}));

	app.route('/api/allpolls').get(pollHandler.getAllPolls);

	app.route('/api/mypolls').get(isLoggedIn, pollHandler.getMyPolls);

	app.route('/api/newpoll')
		.post(isLoggedIn, urlencodedParser, pollHandler.addPoll, function(req, res) {
			res.redirect('/polldetail/' + req.pollId);
		});

	app.route('/api/addOption').post(isLoggedIn, urlencodedParser, pollHandler.addOption);

	app.route('/api/vote').post(urlencodedParser, pollHandler.vote);

	app.route('/api/polldetail/:id').get(pollHandler.getPoll);

	app.route('/api/removepoll/:id').get(isLoggedIn, urlencodedParser, pollHandler.deletePoll);

};
