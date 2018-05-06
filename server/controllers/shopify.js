const shopifyConfig = require('../config/shopify')
const ShopifyAPIClient = require('shopify-api-node')
const { NODE_ENV, BASE_URL, SHOPIFY_APP_PROXY } = process.env

/**
 * GET
 */
exports.shopify = async (req, res) => {
	const {
		session: { shop, shopData }
	} = req

	res.render('shopify/index', {
		title: 'Shopify App!',
		apiKey: shopifyConfig.apiKey,
		shop: shop,
		NODE_ENV,
		BASE_URL,
		SHOPIFY_APP_PROXY,
		shopData: JSON.stringify(shopData || {})
	})
}

exports.install = (req, res) => {
	res.render('shopify/install')
}
exports.getErrorPage = (request, response) => {
	response.json({ success: false, shopSession: request.session.shop || {} })
}
exports.initShop = async (req, res, next) => {
	const {
		session: { accessToken }
	} = req
	const shop = req.query.shop || req.session.shop
	const shopify = new ShopifyAPIClient({ shopName: shop, accessToken })
	const result = await shopifyConfig.shopStore.initializeShop(shopify, shop)
	console.log('initializeShop success', result.success)
	if (result.errors) {
		const { errors } = result
		console.log(shop, 'Error::', errors.statusMessage)
		if (errors.statusCode === 401) {
			req.session.destroy()
			res.redirect('/')
			return
		}
	}
	if (result.shopData) {
		req.session.shopData = (result.shopData && result.shopData.shop) || {}
	}
	next()
}
