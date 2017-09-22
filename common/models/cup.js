'use strict';

module.exports = function (Cup) {
  Cup.on('attached', function () {
    let oldFind = Cup.find;
    Cup.find = function (filter, opt, callback) {
      oldFind.apply(this, [filter, opt, function (error, results) {
        results.forEach((result, index) => {
          if (result && result.toObject) {
            result = result.toObject();
          }

          if (result.players) {
            result.players.forEach((playerData, index) => {
              result.players[index] = playerData.player;
            });

            results[index] = result;
          }
        });

        callback(error, results);
      }]);
    };
  });
};

