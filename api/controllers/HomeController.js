/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
//  */

// var async = require('async'); // kalo mau pake async

function rand_number(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	index: function (req, res) {
		var rand = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		var pegawai, posisi, kota;
		var data_posisi = [], data_kota = [];
		var out;

		Posisi.count().exec(function (err, posisis) {
			Kota.count().exec(function (err, kotas) {
				Pegawai.count().exec(function (err, pegawais) {
					res.view('home', {
						"jml_posisi": posisis,
						"jml_kota": kotas,
						"jml_pegawai": pegawais,
						"data_posisi": data_posisi,
						"data_kota": data_kota
					});

					/* CARA 1
					  var respon_data = {};
					  async.series([
					   function(callback){
						Posisi.count().exec((err, count)=>{
						 respon_data.jml_posisi = count;
						 callback();
						})
					   },
				    
					   function(callback){
						Kota.count().exec((err, count)=>{
						 respon_data.jml_kota = count;
						 callback();
						});
					   },
				    
					   function(callback){
						Pegawai.count().exec((err, count)=>{
						 respon_data.jml_pegawai = count;
						 callback();
						});
					   },
					  ],
				    
					   function(err){
					   respon_data.data_posisi = [];
					   respon_data.data_kota = [];
					   res.view('home', respon_data );
					  });
					  */

					/** CARA 2
					// Kota.find().exec(function (err, kotas) {
					// 	Posisi.find().exec(function (err, posisis) {
					// 		Pegawai.find().exec(function (err, pegawais) {
					// 			var color = '#' + rand[rand_number(0, 9)] + rand[rand_number(0, 9)] + rand[rand_number(0, 9)] + rand[rand_number(0, 9)] + rand[rand_number(0, 9)] + rand[rand_number(0, 9)];
					// 		});
			
							Posisi.count().exec(function (err, posisis) {
								Kota.count().exec(function (err, kotas) {
									Pegawai.count().exec(function (err, pegawais) {
			
													res.view('home', {
														"jml_posisi": posisis,
														"jml_kota": kotas,
														"jml_pegawai": pegawais,
														"data_posisi": data_posisi,
														"data_kota": data_kota
													});
												});
											});
										});
									});
								}); */
				});
			});
		});
	}
}; 