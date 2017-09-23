var payment = require('../model/payment');
var gameProperties = require('../controller/gameProperties');

var savePayment = function(req)
{
	var paymentStore = req.body;
	paymentStore['gameid'] = gameProperties.gameId;
	payment.createPayment(paymentStore);
};

module.exports = savePayment;