'use strict';
let Promise = require('bluebird');

module.exports = app => {
  let team = app.models.Teams;
  let oldFind = team.find;
  team.find = (filter, opt, arg) => {
    oldFind.apply(team, [filter, opt])
      .then(results => {
        for (let result of results) {
          if (filter && filter.include && filter.include.userList && filter.include.userList.user) {
            result.users = result.toObject().userList;
            Object.defineProperty(result, 'userList', {value: null, configurable: true});
            result.userRelations = undefined;

            result.users.forEach((value, index) => {
              let obj = value.user;
              obj.joined = value.joined;
              result.users[index] = obj;
            });
          } else {

          }
        }

        arg(null, results);
      });
  };

};

