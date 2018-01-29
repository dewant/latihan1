/**
 * KotaController
 *
 * @description :: Server-side logic for managing kotas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Excel = require('exceljs');
module.exports = {
	index: function (req, res) {
		res.view('kota/index')
	},

	get: function (req, res) {
		Kota.find().exec(function (err, kotas) {
			var number = 0;
			kotas.forEach(function (kota) {
				kota.number = number;
				kota.act = '<div class="btn-group"><button class="btn btn-warning btn-kota-update" data-id="' + kota.id + '"><i class="glyphicon glyphicon-repeat"></i> Update</button><button class="btn btn-danger btn-kota-delete" data-id="' + kota.id + '" data-toggle="modal" data-target="#konfirmasiHapus"><i class="glyphicon glyphicon-remove-sign"></i> Delete</button><button class="btn btn-info btn-kota-detail" data-id="' + kota.id + '"><i class="glyphicon glyphicon-info-sign"></i> Detail</button></div>';
				number++;
			})
			var data = {
				"data": kotas
			};
			res.send(data);
		})
	},

	add: function (req, res) {
		var out;
		var data = req.param('kota_name');

		if (req.param('kota_name') !== '') {
			Kota.findOrCreate({ kota_name: data }).exec(function (err, kota) {

				out = {
					status: true,
					'data': kota,
					msg: 'Data Kota Sudah Ditambahkan'
				};
				sails.sockets.broadcast('global', 'kota_add', out);
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
		var data = req.param('kota_id');
		Kota.findOne(data).exec(function (err, kota) {
			if (typeof (err) != 'undefined') {

				out = {
					status: true,
					'data': kota
				};
				res.send(out);
			}
		});
	},

	update: function (req, res) {
		var out;
		var data = req.param('kota_name');
		var id = req.param('id');

		if (req.param('kota_name') !== '') {
			Kota.update({ id: id }, { kota_name: data }).exec(function (err, kota) {

				out = {
					status: true,
					msg: 'Data Kota berhasil diupdate'
				};
				sails.sockets.broadcast('global', 'kota_update', out);

				res.send(out);
			});
		}
		else {
			out = {
				status: false,
				msg: 'Data Kota Tidak Boleh Kosong'
			};
			
			res.send(out);
		}
	},

	delete: function (req, res) {
		var out;
		var kota_id = req.param('kota_id');
		Kota.destroy(kota_id).exec(function (err, kota) {
			if (typeof (err) !== 'undefined') {

				out = {
					status: true,
					msg: 'Data Kota berhasil dihapus'
				};
				sails.sockets.broadcast('global', 'kota_delete', out);

				res.send(out);
			}
		});
	},

	detail: function (req, res) {
		var pegawai_name = req.param('name');
		var pegawai_telp = req.param('telp');
		var pegawai_kota_id = req.param('kota_name');
		var pegawai_gender = req.param('gender');
		var kota_id = req.params.kota_id;
		Pegawai.find({ kota: kota_id }).populate('posisi').exec(function (err, pegawais) {
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
		var sheet = workbook.addWorksheet('Data Kota');
		var worksheet = workbook.getWorksheet('Data Kota');

		worksheet.addRow(['ID Kota', 'Nama Kota']);
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

		Kota.find().exec(function (err, kota) {
			var cell = 2;
			kota.forEach(function (val, key) {
				worksheet.addRow([val.id, val.kota_name]);
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

			workbook.xlsx.writeFile('D:/Data Kota.xlsx')
				.then(function () {
					res.download('D:/Data Kota.xlsx', function (err) {
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