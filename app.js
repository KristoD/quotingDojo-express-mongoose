var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quotingDojo');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var quoteSchema = new mongoose.Schema({
    quote: {type: String, required: true, minlength: 2},
    name: {type: String, required: true, minlength: 2},
    created: {type: Date, default: Date.now}
});

var Quote = mongoose.model('Quote', quoteSchema);

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/process', function(req, res) {
    var quote = new Quote({quote: req.body.quote, name: req.body.name})
    quote.save(function(err) {
        if(err) {
            res.render('index', {errors: quote.errors});
        } else {
            res.redirect('/quotes');
        }
    });
});

app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes) {
        if(err) {
            res.send('Something went wrong!')
        } else {
            res.render('quotes', {quotes: quotes});
        }
    });
});

app.listen(8000, function() {
    console.log("Server listening on port 8000...");
});