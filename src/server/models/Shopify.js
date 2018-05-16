const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
	shopDomain: {
		type: String,
		index: true,
		unique: true
	},
	accessToken: String,
	createdAt: Date,
	lastAccess: { type: Date, default: Date.now },
	uninstalledAt: Date,
	closedStore: Boolean,
	metadata: {},
	scriptTags: []
})

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop
