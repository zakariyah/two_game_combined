var mongoose = require('mongoose');
  var informationSchema = new mongoose.Schema({
  gameid: { type: String }
  , playerid: { type: String }
, age: Number
, gender: String
, nationality: String,
qualification: String,
majorfield: String
, familiar: String,
playedbefore: String
});

informationSchema.statics.createInformation = function(information) {

    var newInformation = new this({
       playerid: information.id,
       gameid: information.gameid,
   		 age: information.age
, gender: information.gender
, nationality: information.nationality,
qualification: information.qualification,
majorfield: information.field
, familiar: information.familiarity,
playedbefore: information.experience
    });

    newInformation.save(function(err) {
        if (err)
            throw new Error('Could not create move');
        // callback(err, g);
    })
}

var information = mongoose.model('information',informationSchema);
module.exports = information;

// games database, 