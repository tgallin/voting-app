'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function(app, passport) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

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
				title: 'Voting app - dashboard'
			});
		});

	app.route('/polldetail')
		.get(function(req, res) {
			res.render('polldetail', {
				loggedIn: req.isAuthenticated(),
				title: 'Voting app - poll detail'
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

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
