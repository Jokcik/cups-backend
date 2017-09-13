'use strict';
let Promise = require('bluebird');

module.exports = app => {
  let Cup = app.models.Cup;

  Cup.oldFind = Cup.find;
  Cup.find = (a, b) => {
    return Cup.oldFind(a, b);
  };

  console.log('exports', Cup.find);
};
