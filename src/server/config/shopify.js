const ShopifyModel = require('../models/Shopify')
const url = require('url')

const {
	SHOPIFY_APP_KEY,
	BASE_URL,
	SHOPIFY_APP_SECRET,
	SHOPIFY_APP_SCOPE
} = process.env

class ShopifyMongoStrategy {
	constructor() {
		this.scriptTagUrl = BASE_URL + '/assets/script-tag.js'
	}

	getScriptTagsRequestUrl(shop) {
		return url.parse('https://' + shop + '/admin/script_tags.json')
	}

	getMetaRequestUrl(shop) {
		return url.parse('https://' + shop + '/admin/shop.json')
	}

	async storeShop({ shop, accessToken }) {
		const existedShop = await this.getShop({ shop })
		if (!existedShop) {
			const data = new ShopifyModel({
				shopDomain: shop,
				accessToken
			})
			data.save()
		} else {
			ShopifyModel.findOneAndUpdate(
				{ shopDomain: shop },
				{ accessToken },
				() => {
					console.log(shop, 'updated shop')
				}
			)
		}
		console.log('storeShop', shop, accessToken)

		return { accessToken }
	}

	getShop({ shop }) {
		console.log('get Shop', shop)
		return new Promise(resolve => {
			ShopifyModel.findOne({ shopDomain: shop }, (err, shop) => {
				if (err) {
					resolve(null)
				} else {
					resolve(shop)
				}
			})
		})
	}

	async initializeShop(shopify, shopDomain, accessToken) {
		const shop = await this.getShop({ shop: shopDomain })
		if (!shop) {
			await this.storeShop({ shop: shopDomain, accessToken })
			return this.updateShop(shopify, shopDomain)
		} else {
			return this.updateShop(shopify, shopDomain)
		}
	}

	async updateShopMetadata(shopify, shopDomain) {
		return new Promise(async resolve => {
			console.log('update shop')
			let result = { success: true }
			// Get and update shop meta
			const shopData = await shopify
				.request(this.getMetaRequestUrl(shopDomain))
				.catch(e => {
					console.log(shopDomain, e.statusMessage)
					result.success = false
					result.errors = e
				})

			if (shopData) {
				result.shopData = shopData
				ShopifyModel.findOneAndUpdate(
					{ shopDomain },
					{ metadata: shopData.shop, lastAccess: new Date() },
					{ upsert: true },
					() => {
						console.log(shopDomain, 'updated Shop')
					}
				)
			} else {
				result.success = false
			}
			resolve(result)
		})
	}

	async updateShop(shopify, shop) {
		return new Promise(async resolve => {
			const result = await this.updateShopMetadata(shopify, shop)
			resolve(result)
			if (result.success) {
				(async () => {
					const scriptTags =
						(await this.getScriptTagsFromAPI(shopify, shop))
							.script_tags || []
					const scriptTags2 =
						(await this.getScriptTagsFromDB(shop)).script_tags || []

					const installedScriptTag = scriptTags.filter(
						script => script.src === this.scriptTagUrl
					)[0]
					console.log(
						shop,
						'already installed script tags',
						installedScriptTag && installedScriptTag.src
					)
					if (!installedScriptTag) {
						//Remove old script tags
						await this.removeOldScriptTags(shopify, shop, [
							...scriptTags,
							...scriptTags2
						])
						// append new script tag
						this.addAppScriptTag(shopify, shop)
					} else {
						// Update script tag info
						this.updateScriptTagsToDB(shop, scriptTags)
					}
				})()
			}
		})
	}

	updateScriptTagsToDB(shopDomain, scriptTags) {
		ShopifyModel.findOneAndUpdate({ shopDomain }, { scriptTags }, () => {
			console.log(shopDomain, 'updated script tags to DB')
		})
	}

	getScriptTagsFromDB(shopDomain) {
		return new Promise(resolve => {
			ShopifyModel.findOne({ shopDomain }, (err, data) => {
				if (err) {
					console.log('Error finding Shop::', shopDomain)
					resolve(null)
				} else {
					resolve((data && data.scriptTags) || [])
				}
			})
		})
	}

	async getScriptTagsFromAPI(shopify, shopDomain) {
		return await shopify.request(
			this.getScriptTagsRequestUrl(shopDomain),
			'GET'
		)
	}

	async removeOldScriptTags(shopify, shopDomain, oldScriptTags) {
		const promise = oldScriptTags.map(script => {
			console.log('remove old script tag', script.src)
			return shopify.request(
				url.parse(
					'https://' +
						shopDomain +
						'/admin/script_tags/' +
						script.id +
						'.json'
				),
				'DELETE'
			)
		})
		return Promise.all(promise)
	}

	async addAppScriptTag(shopify, shopDomain) {
		const scriptTags = await shopify.request(
			this.getScriptTagsRequestUrl(shopDomain),
			'POST',
			null,
			{
				script_tag: {
					event: 'onload',
					src: this.scriptTagUrl,
					display_scope: 'order_status'
				}
			}
		)
		console.log(shopDomain, 'Added Script tags')
		this.updateScriptTagsToDB(scriptTags)
	}
}

const shopifyConfig = {
	host: BASE_URL,
	apiKey: SHOPIFY_APP_KEY,
	secret: SHOPIFY_APP_SECRET,
	scope: [SHOPIFY_APP_SCOPE],
	shopStore: new ShopifyMongoStrategy(),
	afterAuth(request, response) {
		return response.redirect('/')
	}
}

module.exports = shopifyConfig
