var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        pay_name: String,
        number: String
    }
);

var Payment = mongoose.model('Payment', schema, 'payment');

module.exports = Payment;