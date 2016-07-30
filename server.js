var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var Review = require('./app/models/review');
var User = require('./app/models/user');
var reviewController = require('./app/controllers/review');
var userController = require('./app/controllers/user');
var authController = require('./app/controllers/authentication');

//log all request in the apache combined format to stdout
app.use(morgan('combined'));

//mongodb config
var mongoose = require('mongoose');
var dbUrl = 'mongodb://127.0.0.1/reviews';
mongoose.connect(dbUrl);

//use body-parser middleware to get post data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:'*/*'}));

var port = process.env.PORT||8000;


/*
	route for CURD
 */
var router = express.Router();
router.route('/reviews')
	.get(authController.authRequired,reviewController.getAllReviews)
	.post(authController.authRequired,reviewController.postReview);

router.route('/reviews/:id')
	.get(authController.authRequired,reviewController.getOneReview)
	.put(authController.authRequired,reviewController.putReview)
	.delete(authController.authRequired,reviewController.deleteReview);

router.route('/signup')
	.post(userController.signup);

router.route('/token')
	.post(authController.userCreateToken);


app.use('/api',router);
app.listen(port);
console.log('the server is running on '+port );
