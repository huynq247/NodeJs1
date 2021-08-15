//add Nodejs - Util module
const util = require ('util');
//add custom notify 
const notify = require( __path_configs + 'notify'); 

const options = {
    name: {min: 6, max: 20},
    ordering: { min : 0, max: 100},
    status: { value: 'novalue'}
}

module.exports = {
    validator: (req) => {
        req.checkBody('name', util.format(notify.ERROR_NAME,options.name.min,options.name.max)).isLength({min: options.name.min, max: options.name.max});
        req.checkBody('ordering', "Phai la so").isInt({gt: 0, lt: 100});
        req.checkBody('status',"Status phải khác null").isNotEqual("novalue");
    }
}














// module.exports = {
//     validator : (req) => {
//         req.checkBody('name', "Khong duoc rong").isLength({min: 5, max: 30});
//         req.checkBody('ordering', "Phai la so").isInt({gt: 0, lt: 100});
//         req.checkBody('status',"Status phải khác null").isNotEqual("novalue");
//     }
// }







