/**
 * PosisiController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Excel = require('exceljs');
module.exports = {
	index: function (req, res) {
		res.view('posisi/index');
	},

	get: function (req, res) {
		Posisi.find().exec(function (err, posisis) {
			var number = 0;
			posisis.forEach(function (posisi) {
				posisi.number = number;
				posisi.act = '<div class="btn-group"><button class="btn btn-warning btn-posisi-update" data-id="' + posisi.id + '"><i class="glyphicon glyphicon-repeat"></i> Update</button><button class="btn btn-danger btn-posisi-delete" data-id="' + posisi.id + '" data-toggle="modal" data-target="#konfirmasiHapus"><i class="glyphicon glyphicon-remove-sign"></i> Delete</button><button class="btn btn-info btn-posisi-detail" data-id="' + posisi.id + '"><i class="glyphicon glyphicon-info-sign"></i> Detail</button></div>';
				number++;
			})
			var data = {
				"data": posisis
			};


			res.send(data);
		})
	},

	add: function (req, res) {
		var out;
		var data = req.param('posisi_name');

		if (req.param('posisi_name') !== '' ) {
			Posisi.findOrCreate({ posisi_name: data }).exec(function (err, posisi) {
				out = {
					status: true,
					msg: 'Data Posisi berhasil ditambahkan'
				};
				sails.sockets.broadcast('global', 'posisi_add', out);
				res.send(out);
			});
		}
		else {
			out = {
				status: false,
				msg: 'Harap Periksa Kembali Data Anda'
			};
			res.send(out);
		}
	},

	show_edit: function (req, res) {
		var out;
		var data = req.param('posisi_id');
		Posisi.findOne(data).exec(function (err, posisi) {
			if (typeof (err) != 'undefined') {

				out = {
					status: true,
					'data': posisi
				};
				res.send(out);
			}
		});
	},

	update: function (req, res) {
		var out;
		var data = req.param('posisi_name');
		var id = req.param('id');

		if (req.param('posisi_name') !== '') {
			Posisi.update({ id: id }, { posisi_name: data }).exec(function (err, posisi) {

				out = {
					status: true,
					msg: 'Data Posisi berhasil diupdate'
				};
				sails.sockets.broadcast('global', 'posisi_update', out);

				res.send(out);
			});
		}
		else {
			out = {
				status: false,
				msg: 'Harap Periksa Kembali Data Anda'
			};
			res.send(out);
		}
	},

	delete: function (req, res) {
		var out;
		var posisi_id = req.param('posisi_id');
		Posisi.destroy(posisi_id).exec(function (err, posisi) {
			if (typeof (err) !== 'undefined') {

				out = {
					status: true,
					msg: 'Data Posisi berhasil dihapus'
				};
				sails.sockets.broadcast('global', 'posisi_delete', out);

				res.send(out);
			}
		});
	},

	detail: function (req, res) {
		var pegawai_name = req.param('name');
		var pegawai_telp = req.param('telp');
		var pegawai_kota_id = req.param('kota_name');
		var pegawai_gender = req.param('gender');
		var posisi_id = req.params.posisi_id;
		Pegawai.find({ posisi: posisi_id }).populate('kota').exec(function (err, pegawais) {
			var number = 0;
			pegawais.forEach(function (pegawai) {
				pegawai.number = number;
				pegawai.act = '<div class="btn-group"><button class="btn btn-warning btn-pegawai-update" data-id="' + pegawai.id + '"><i class="glyphicon glyphicon-repeat"></i> Update</button><button class="btn btn-danger btn-pegawai-delete" data-id="' + pegawai.id + '" data-toggle="modal" data-target="#konfirmasiHapus"><i class="glyphicon glyphicon-remove-sign"></i> Delete</button><button class="btn btn-info btn-pegawai-detail" data-id="' + pegawai.id + '"><i class="glyphicon glyphicon-info-sign"></i> Detail</button></div>';
				number++;
			});

			var data = {
				"data": pegawais
			};

			res.send(data);
		})
	},
	export: function (req, res) {

		var workbook = new Excel.Workbook;
		var sheet = workbook.addWorksheet('Data Posisi');
		var worksheet = workbook.getWorksheet('Data Posisi');

		worksheet.addRow(['ID Posisi', 'Nama Posisi']);
		worksheet.getCell('A1').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};
		worksheet.getCell('B1').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};

		Posisi.find().exec(function (err, posisi) {
			var cell = 2;
			posisi.forEach(function (val, key) {
				worksheet.addRow([val.id, val.posisi_name]);
				worksheet.getCell('A' + cell).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('B' + cell).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				cell++;
			})
			worksheet.getRow(1).font = { size: 12, bold: true };
			worksheet.getColumn(1).width = 28;
			worksheet.getColumn(2).width = 20;

			workbook.xlsx.writeFile('D:/Data Posisi.xlsx').then(function () {
				res.download('D:/Data Posisi.xlsx', function (err) {
					if (err) {
						return res.serverError(err);
					} else {
						return res.ok();
					}
				});
			});
		})
	}
};