var mongoose = require('mongoose');
  var chatHistorySchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String },
  history: {type : Array}
});

chatHistorySchema.statics.createChatHistory = function(gameId, id, history) {

    var newChatHistory = new this({
       playerid: id,
       gameid: gameId,
       history: history
    });
    // console.log(hiitInfo);
    newChatHistory.save(function(err) {
        if (err)
            throw new Error('Could not create move');
      // console.log("hereree");
    })
}


var chatHistory = mongoose.model('chatHistory',chatHistorySchema);
module.exports = chatHistory;