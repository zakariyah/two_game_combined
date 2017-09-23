var mongoose = require('mongoose');
  var moveSchema = new mongoose.Schema({
  gameid: { type: String },
  round: Number,
  playerid: String,
  action: String,     // 1 for cooperate and 2 for defect
  actionValue: Number,     // depending on the matrix
  playerid2: String,
  action2: String,
  actionValue2: Number,
  actiontype: String,  // indicates whether action was random or intentional 0 for random and 1 for intentional
  actiontype2 : String, 
  hasRecommender : String, 
  hasRecommender2 : String,
  recommendedAction : Number,  // action recommended by algorithm
  recommendedAction2 : Number,
  timeOfAction : Number,  // time taken to respond to action
  timeOfAction2 : Number,
  isAgent : String,  // indicates whether it is agent
  isAgent2 : String,
  hiitNumber1 : String,
  hiitNumber2 : String,
  recommendertype : String,
  recommendertype2 : String   // recommender is null, random or S++
});

// link first survey to moves and post-survey.


moveSchema.statics.createMove = function(move) {

    var newMove = new this({
       gameid: move.gameid,
   		 round: move.round,
   		 playerid: move.playerid,
   		 action: move.action,
   		 actionValue: move.actionValue,
       playerid2: move.playerid2,
       action2: move.action2,
       actionValue2: move.actionValue2,
       actiontype: move.actiontype,
       actiontype2: move.actiontype2,
hasRecommender : move.hasRecommender,
hasRecommender2 : move.hasRecommender2,
recommendedAction : move.recommendedAction,
recommendedAction2 : move.recommendedAction2,
timeOfAction : move.timeOfAction,
timeOfAction2 : move.timeOfAction2,
isAgent : move.isAgent,
isAgent2 : move.isAgent2,
hiitNumber1 : move.hiitNumber1,
hiitNumber2 : move.hiitNumber2,
recommendertype : move.recommendertype,
recommendertype2: move.recommendertype2
    });

    newMove.save(function(err) {
        if (err)
            throw new Error('Could not create move');
        // callback(err, g);
    })
}

moveSchema.statics.getMovesFromHiitNumber = function(hiitInfo, callback) {
    //needing
   this.find({ $and : [
    {gameid : hiitInfo.gameid},
    {$or : [{hiitNumber1 : hiitInfo.id}, {hiitNumber2 : hiitInfo.id}]}
    ]}, callback);
}


var Moves2 = mongoose.model('Moves2', moveSchema);
module.exports = Moves2;