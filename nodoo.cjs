// MIT License (see LICENSE file)
// Copyright (C) 2024 Rutio AB, all rights reserved.
// Author: Lars Mats

const util = require('util');
var Odoo = require('odoo-xmlrpc');

// Internal functions

exports.connect = async (params) => {
    this.odoo = new Odoo(params);
    this.odooExecute = util.promisify(this.odoo.execute_kw).bind(this.odoo);
    const odooConnect = util.promisify(this.odoo.connect).bind(this.odoo);
    await odooConnect();
    return true;
}

exports.execute = async (table, operation, where, fields) => {
    if (!this.odoo) throw {message: 'Call connect first'};
    if (typeof (table) !== 'string' || table.length < 2) throw {message: 'expected table to be a string'};
    if (typeof (operation) !== 'string' || operation.length < 2) throw {message: 'expected operation to be a string'};
    if (typeof (where) !== 'object') throw {message: 'expected where to be an object'};
    if (undefined !== fields && !Array.isArray(fields)) throw {message: 'expected fields to be array of field names OR null'};

    // Form a list of checks to check
    let whereArray = [];
    let whereKeys = Object.keys(where);
    for (let i = 0; i < whereKeys.length; ++i) {
        const key = whereKeys[i];
        const value = where[key];
        whereArray.push([key, '=', value]);
    }

    var params = [];
    params.push(whereArray);
    params.push(fields);
    const result = await this.odooExecute(table, operation, [params]); 
    return result;
}

exports.search_read = async (table, where, fields) => {
    const results = await exports.execute(table, 'search_read', where, fields);
    if (!Array.isArray(results))
        throw {message:'search_read: Expected array of values'};
    return results;
}

exports.search_read_unique = async (table, where, fields) => {
    const results = await this.search_read(table, where, fields);
    if (results.length !== 1)
        throw {message: 'search_read_unique: Expected exactly one result, got ' + results.length};
    return results[0];
}

exports.create = async (table, values) => {
    if (!this.odoo) throw {message: 'Call connect first'};
    if (typeof (table) !== 'string' || table.length < 2) throw {message: 'expected table to be a string'};
    if (typeof (values) !== 'object' ) throw {message: 'expected create value to be an object'};

    var params = [ values ];
    const createdId = await this.odooExecute(table, 'create', [params]); 
    return createdId;
}

// Add on more...
