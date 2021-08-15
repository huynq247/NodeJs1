const mongoose = require('mongoose');
const database_Config = require( __path_configs + 'database');

var schema = new mongoose.Schema({
    name: 'string',
    status: 'string',
    ordering: 'string',
});

module.exports = mongoose.model(`${database_Config.col_items}`,schema);