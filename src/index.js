/**
 * Module dependencies.
 */
import express from 'express'
const compression = require('compression')
const session = require('express-session')
const logger = require('morgan')
const chalk = require('chalk')
const errorHandler = require('errorhandler')
const lusca = require('lusca')
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const expressValidator = require('express-validator')
const http = require('http')
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

dotenv.load({
	path: '.env'
})

const { NODE_ENV, PUBLIC_PATH, BABEL_ENV } = process.env

/**
 * Create Express server.
 */
const app = express()
console.log(NODE_ENV)
if (NODE_ENV === 'development') {
	const webpack = require('webpack')
	const config = require('./client/webpack.config')
	const webpackMiddleware = require('webpack-dev-middleware')
	const webpackHotMiddleware = require('webpack-hot-middleware')
	const compiler = webpack(config)
	const middleware = webpackMiddleware(compiler, {
		hot: true,
		inline: true,
		publicPath: PUBLIC_PATH + '/',
		stats: {
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false
		}
	})
	app.use(middleware)
	app.use(webpackHotMiddleware(compiler))
} else {
	const staticPath = path.resolve(__dirname, '..' + PUBLIC_PATH)
	console.log(PUBLIC_PATH, staticPath)
	app.use(
		PUBLIC_PATH,
		express.static(staticPath, {
			maxAge: 31557600000
		})
	)
}

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', err => {
	console.error(err)
	console.log(
		'%s MongoDB connection error. Please make sure MongoDB is running.',
		chalk.red('✗')
	)
	process.exit()
})

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
app.set(
	'port',
	process.env.HTTPS_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
)
app.set('views', path.join(__dirname, './server/views'))
app.set('view engine', 'pug')
app.use(compression())
app.use(logger('dev'))
app.use(expressValidator())
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: process.env.SHOPIFY_APP_SECRET,
		cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
		store: new MongoStore({
			url: process.env.MONGODB_URI,
			autoReconnect: true
		})
	})
)
const allowCorsList = []
app.use((req, res, next) => {
	if (allowCorsList.filter(string => req.url.includes(string)).length) {
		res.header('Access-Control-Allow-Origin', req.headers.origin)
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		)
		res.header('Access-Control-Allow-Credentials', 'true')
	} else if (req.url.includes('/shopify/proxy/manythanks')) {
		res.header('Content-Type', 'application/liquid')
	}
	next()
})

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(lusca.xssProtection(true))
app.use((req, res, next) => {
	res.locals.user = req.user
	next()
})

// Router
const router =
	NODE_ENV === 'development' || BABEL_ENV === 'node'
		? require('./server/router')
		: require('./router')

app.use(router)

/**
 * Error Handler.
 */
app.use(errorHandler())

global.__DEV__ = NODE_ENV !== 'production'
global.projectRoot = path.resolve(__dirname, '../')

/**
 * Start Express server.
 */
const HTTP_PORT = !__DEV__ ? process.env.HTTP_PORT || 80 : 8080
const httpServer = http.createServer(app)
console.log(`%s App listening on http port: ${HTTP_PORT}`, chalk.green('✓'))

httpServer.listen(HTTP_PORT)

module.exports = app
