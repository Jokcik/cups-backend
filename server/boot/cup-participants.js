'use strict';
let Promise = require('bluebird');

module.exports = app => {
  let Cup = app.models.Cup;
  let User = app.models.Users;
  let Team = app.models.Teams;

  Cup.oldFind = Cup.find;
  Cup.find = (filter, opt, arg) => {
    Cup.oldFind(filter, opt)
      .then(cups => setParticipantByTypeCup(filter, cups, arg))
      .then(results => {
        results.forEach(value => value.cup.participantIds = value.participantIds);
        if (filter) {
          arg(null, results.map(value => value.cup));
        }
      });
  };

  function setParticipantByTypeCup(filter, cups, arg) {
    let promises = [];
    if (filter) {
      for (let cup of cups) {
        if (!cup.participantIds) continue;

        let filterCup = {where: {or: cup.participantIds.map(value => {return {id: value} })}};
        let promise = cup.type === 0 ? User.find(filterCup) : Team.find(filterCup);
        promises.push(promise.then(participantIds => {return {cup, participantIds}}));
      }
    } else {
      arg(null, cups);
    }
    return Promise.all(promises);
  }
};

