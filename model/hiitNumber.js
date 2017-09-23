var mongoose = require('mongoose');
  var hiitNumberSchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
});

hiitNumberSchema.statics.createHiitSchema = function(hiitInfo) {

    var newHiitNumber = new this({
       playerid: hiitInfo.id,
       gameid: hiitInfo.gameid,
    });
    // console.log(hiitInfo);
    newHiitNumber.save(function(err) {
        if (err)
            throw new Error('Could not create move');
      // console.log("hereree");
    })
}

hiitNumberSchema.statics.findHiitNumberPresentInGame = function(hiitInfo, callback) {
    // console.log(hiitInfo);
   this.find({playerid : hiitInfo.id, gameid : hiitInfo.gameid}, callback);
}


var hiitNumber = mongoose.model('hiitNumber',hiitNumberSchema);
module.exports = hiitNumber;
// akyuusuf