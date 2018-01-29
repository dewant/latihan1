


module.exports = function(req, res, next) {

if (req.session.data_login === undefined) {
			res.redirect('/');
		}else{
			return next();
		}
};
