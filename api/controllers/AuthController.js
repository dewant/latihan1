/**
 * AuthController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var md5 	= require('md5');
module.exports = {
	login: function(req, res) {
		var out;

		if (req.param('username') != '' && req.param('password') != '') {
			Admin.findOne({
				nama: req.param('username'),
				password: req.param('password')		
			}).exec(function(err,user){
				if(user){
					out = {
						status: true
					};
					req.session.data_login = user;					
				}

				res.send(out);
			});
		} 
		else {

			out = {
				status: false,
				msg: 'Username/Password tidak boleh kosong !'
			}; 
			res.send(out);
		}
	},
	logout: function(req, res) {
		req.session.destroy();
		res.redirect('/');
	}
};