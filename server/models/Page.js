const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
	shopDomain: {
		type: String,
		index: true
	},
	type: String,
	html: String,
	data: { type: Object, default: {} },
	createdAt: { type: Date, default: Date.now },
	metadata: { type: Object, default: {} },
	configs: { type: Object, default: {} },
	status: String,
	updatedAt: { type: Date, default: Date.now },
	js: [],
	css: [],
	style: String
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
