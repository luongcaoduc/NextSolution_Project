'use strict';
const ok = require('./ok');
const error = require('./error');
const unAuthorize = require('./unAuthorize');
const created = require('./created');
const conflict = require('./conflict');
const notfound = require('./notfound')
module.exports = { ok, error, unAuthorize, created , conflict, notfound};
