const express = require('express')
const app = express.Router()
const ShopifyExpress = require('@shopify/shopify-express')
const shopifyConfig = require('./config/shopify')
const shopifyController = require('./controllers/shopify')
const shopify = ShopifyExpress(shopifyConfig)

// Mount Shopify Routes
const { routes, middleware } = shopify
const { withShop } = middleware
const shopifyAuth = withShop({
	authBaseUrl: '/shopify',
	fallbackUrl: '/shopify/install'
})
const shopifyAuthApi = withShop({
	authBaseUrl: '/shopify',
	fallbackUrl: '/shopify/error'
})

app.use('/shopify', routes)

const validateShop = (req, res, next) => {
	const {
		session: { shop }
	} = req
	const queryShop = req.query.shop
	console.log('session shop::', shop, 'query shop::', queryShop)
	if (!queryShop && shop) {
		const redirect = `${req.url}${
			req.url.includes('?') ? '&shop=' : '?shop='
		}${shop}`
		console.log('redirect', redirect)
		return res.redirect(redirect)
	} else if (queryShop && shop !== queryShop) {
		req.session.destroy()
	}
	next()
}

/**
 * Primary app routes.
 */
app.get(
	'/',
	shopifyAuth,
	validateShop,
	shopifyController.initShop,
	shopifyController.shopify
)
app.get('/shopify/install', shopifyController.install)
app.get('/shopify/error', shopifyController.getErrorPage)

module.exports = app
