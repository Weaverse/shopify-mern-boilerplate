const path = require('path')
const webpack = require('webpack')

const dotenv = require('dotenv')

dotenv.load({
	path: process.env.NODE_ENV === 'test' ? '.env.example' : '.env'
})

const { NODE_ENV, PUBLIC_PATH } = process.env
const isDevelopment = NODE_ENV !== 'production'

const plugins = [
	...[
		new webpack.DefinePlugin({
			'process.env': {
				ENV: JSON.stringify(NODE_ENV),
				NODE_ENV: JSON.stringify(NODE_ENV),
				BABEL_ENV: JSON.stringify(NODE_ENV),
				PUBLIC_PATH: JSON.stringify(PUBLIC_PATH)
			}
		})
	],
	...(isDevelopment ? [new webpack.HotModuleReplacementPlugin()] : [])
]

const extraEntryFiles = isDevelopment
	? ['react-hot-loader/patch', 'webpack-hot-middleware/client']
	: []

const defaultConfigs = {
	devtool: !isDevelopment ? false : 'cheap-eval-source-map',
	target: 'web',
	mode: NODE_ENV
}
module.exports = [
	// Build script tag
	{
		...defaultConfigs,
		entry: path.resolve(__dirname, './script_tag/index.js'),
		output: {
			filename: 'script-tag.js',
			path: path.resolve(__dirname, '..' + PUBLIC_PATH)
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: 'babel-loader',
					exclude: /node_modules/
				}
			]
		}
	},
	// Build React app
	{
		...defaultConfigs,
		plugins,
		entry: {
			main: [
				...extraEntryFiles,
				'@shopify/polaris/styles.css',
				path.resolve(__dirname, './src/index.js')
			]
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, '..' + PUBLIC_PATH)
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: 'babel-loader',
					exclude: /node_modules/
				},

				{
					test: /\.css$/,
					exclude: /node_modules/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							query: {
								sourceMap: isDevelopment,
								modules: true,
								importLoaders: 1,
								localIdentName: '[name]-[local]_[hash:base64:5]'
							}
						},
						{
							loader: 'postcss-loader'
						}
					]
				},
				{
					test: /\.css$/,
					include: /node_modules/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							query: {
								sourceMap: isDevelopment,
								modules: true,
								importLoaders: 1,
								localIdentName: '[local]'
							}
						}
					]
				}
			]
		}
	}
]
