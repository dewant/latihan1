module.exports = {

    attributes: {
    //    kota : {
    //     model : 'kota'
    //    },
        // collection: 'kota'
    // posisi : {
    //     model : 'posisi',
    // }
    name : {
        type : 'string',
        // required : true
    },
    telp : {
        type : 'string',
        // required : true
    },
    kota : {
        model : 'kota',
        // required : true
    },
    gender : {
        type : 'string',
        // required : true
    },
    posisi: { 
        model : 'posisi',
        // required : true
    }
}
};
  