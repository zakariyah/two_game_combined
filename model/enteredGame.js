var mongoose = require('mongoose');
  var enteredGameSchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
});

enteredGameSchema.statics.createEnteredGame = function(hiitInfo) {

    var newEnteredGame = new this({
       playerid: hiitInfo.id,
       gameid: hiitInfo.gameid,
    });
    // console.log(hiitInfo);
    newEnteredGame.save(function(err) {
        if (err)
            throw new Error('Could not create move');
      // console.log("hereree");
    })
}

enteredGameSchema.statics.findHiitNumberPresentInGame = function(hiitInfo, callback) {
    // console.log(hiitInfo);
   this.find({playerid : hiitInfo.id, gameid : hiitInfo.gameid}, callback);
}


var enteredGame = mongoose.model('enteredGame',enteredGameSchema);
module.exports = enteredGame;