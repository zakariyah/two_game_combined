var mongoose = require('mongoose');
  var paymentSchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
  , totalScore: Number
  , numberOfRounds : Number
});

paymentSchema.statics.createPayment = function(hiitInfo) {
    var newPayment = new this({
       playerid: hiitInfo.playerid,
       gameid: hiitInfo.gameid,
       totalScore : hiitInfo.cummulativeScore,
       numberOfRounds : hiitInfo.numberOfRounds
    });

    newPayment.save(function(err) {
        if (err)
            throw new Error('Could not create move');
    })
}

var payment = mongoose.model('payment',paymentSchema);
module.exports = payment;