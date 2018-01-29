/**
 * PegawaiController
 *
 * @description :: Server-side logic for managing pegawais
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Excel = require('exceljs');
module.exports = {
	index: function (req, res) {
		var kota;
		var posisi;
		Kota.find().exec(function (err, kotas) {
			Posisi.find().exec(function (err, posisis) {

				res.view('pegawai/index', {
					"Kota": kotas,
					"Posisi": posisis
				});
			})
		})
	},

	get: function (req, res) {
		var out;
		var pegawai_name = req.param('name');
		var pegawai_telp = req.param('telp');
		var pegawai_kota_name = req.param('kota_name');
		var pegawai_gender = req.param('gender');
		var pegawai_posisi = req.param('posisi_name');
		Pegawai.find().populate(['kota', 'posisi']).exec(function (err, pegawais) {
			var number = 0;
			pegawais.forEach(function (pegawai) {
				pegawai.number = number;
				pegawai.act = '<div class="btn-group"><button class="btn btn-warning btn-pegawai-update" data-id="' + pegawai.id + '"><i class="glyphicon glyphicon-repeat"></i> Update</button><button class="btn btn-danger btn-pegawai-delete" data-id="' + pegawai.id + '" data-toggle="modal" data-target="#konfirmasiHapus"><i class="glyphicon glyphicon-remove-sign"></i> Delete</button></div>';
				number++;
			});

			var data = {
				"data": pegawais
			};

			res.send(data);
		})
	},

	add: function (req, res) {
		var out;
		// var name = req.param('name');
		// var telp = req.param('telp');
		// var gender = req.param('gender');
		// var kota = req.param('kota_name');
		// var posisi = req.param('posisi');

		var add_data = {
			name: req.param('name'),
			telp: req.param('telp'),
			kota: req.param('kota_name'),
			gender: req.param('gender'),
			posisi: req.param('posisi_name')
		}

		if (req.param('name') !== '' && req.param('telp') !== '' && req.param('gender') !== '' ) {
			Pegawai.create(add_data).exec(function (err, pegawai) {

				out = {
					status: true,
					msg: 'Data Pegawai Berhasil Ditambahkan'
				};
				sails.sockets.broadcast('global', 'pegawai_add', out);
				res.send(out);
			});
		}
		else {
			out = {
				status: false,
				msg: 'Data Tidak Boleh Kosong'
			};

			res.send(out);
		}
	},

	show_edit: function (req, res) {
		var out;
		var data = req.param('pegawai_id');
		Pegawai.findOne(data).exec(function (err, pegawai) {

			out = {
				status: true,
				'data': pegawai
			};
			res.send(out);
		});
	},

	update: function (req, res) {
		var out;
		var id = req.param('id');
		var update_data = {
			name: req.param('name'),
			telp: req.param('telp'),
			kota: req.param('kota_name'),
			gender: req.param('gender'),
			posisi: req.param('posisi_name')
		}

		if (req.param('name') !== '' && req.param('telp') !== '' && req.param('gender') !== '' ) {
			Pegawai.update({ id: id }, update_data).exec(function (err, pegawai) {

				out = {
					status: true,
					msg: 'Data Pegawai berhasil diupdate'
				};
				sails.sockets.broadcast('global', 'pegawai_update', out);

				res.send(out);
			});
		}
			else {
			out = {
				status: false,
				msg: 'Data Tidak Boleh Kosong'
			};

			res.send(out);
		}
	},

	delete: function (req, res) {
		var out;
		var pegawai_id = req.param('pegawai_id');
		Pegawai.destroy(pegawai_id).exec(function (err, pegawai) {
			if (typeof (err) !== 'undefined') {

				out = {
					status: true,
					msg: 'Data Pegawai berhasil dihapus'
				};
				sails.sockets.broadcast('global', 'pegawai_delete', out);

				res.send(out);
			}
		});
	},

	export: function (req, res) {

		var workbook = new Excel.Workbook;
		var sheet = workbook.addWorksheet('Data Pegawai');
		var worksheet = workbook.getWorksheet('Data Pegawai');

		worksheet.addRow(['ID Pegawai', 'Nama Pegawai', 'Kontak Pegawai', 'Jenis Kelamin', 'Posisi', 'Kota']);
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
		worksheet.getCell('C1').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};
		worksheet.getCell('D1').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};
		worksheet.getCell('E1').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};
		worksheet.getCell('F1').border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'thin' },
			right: { style: 'thin' }
		};

		Pegawai.find().populate(['kota', 'posisi']).exec(function (err, pegawai) {
			var cell = 2;
			pegawai.forEach(function (val, key) {
				worksheet.addRow([val.id, val.name, val.telp, val.gender, val.posisi.posisi_name, val.kota.kota_name]);
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
				worksheet.getCell('C' + cell).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('D' + cell).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('E' + cell).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				worksheet.getCell('F' + cell).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				cell++;
			});

			// Style
			worksheet.getRow(1).font = { size: 12, bold: true };
			worksheet.getColumn(1).width = 28;
			worksheet.getColumn(2).width = 18;
			worksheet.getColumn(3).width = 18;
			worksheet.getColumn(4).width = 18;
			worksheet.getColumn(5).width = 18;
			worksheet.getColumn(6).width = 18;
			worksheet.getColumn(7).width = 18;

			workbook.xlsx.writeFile('D:/Data Pegawai.xlsx')
				.then(function () {
					res.download('D:/Data Pegawai.xlsx', function (err) {
						if (err) {
							return res.serverError(err);
						} else {
							return res.ok();
						}
					});
				});
		});
	}
};