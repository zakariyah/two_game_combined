var mongoose = require('mongoose');
    function connect(connectionString) {
        mongoose.connect(connectionString)
        // if (mode === 'development')
        //     mongoose.set('debug', true)
        var db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function callback() {
            console.log('Mongoose connected at: ', connectionString)
        })
    }

    //When the Node process ends close the connection to the database
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });

});

module.exports = connect
