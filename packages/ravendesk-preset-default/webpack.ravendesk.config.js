const path = require('path'),
	Extractor = require('./modules/extractor-plugin/index.js'),
	MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	output: {
		filename: 'tmp.js',
		libraryTarget: 'commonjs2'
	},
	target: 'node',
	externals: [ require('webpack-node-externals')() ],
	module: {
		rules: [
		{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				'babel-loader',
				'simple-frontmatter-loader',
			]
		},
		{
			test: /\.mdx?$/,
			exclude: /node_modules/,
			use: [
				'babel-loader',
				{
					loader: 'mdx-jsx-loader',
					options: {
						process: (data) => `import { dom } from 'isomorphic-jsx'; import { MDXTag } from 'mdxtag'; ${data}`
					}
				},
				'simple-frontmatter-loader',
			]
		},
		{
			test: /\.html$/,
			use: [
				{
					loader: 'simple-frontmatter-loader',
					options: {
						use: [{ loader: 'html-loader', options: { exportAsEs6Default: 'es6' } }]
					}
				}
			]
		},
		{ test: /\.(css|sass|scss)$/, use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ] },
		{ test: /\.(png|jpg|gif)$/, loader: 'file-loader' },
		]
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new Extractor({ filename: 'tmp.js' }),
	],
	resolve: {
		extensions: ['.js', '.jsx', '.md', '.mdx', '.html'],
		modules: [ path.resolve(__dirname, 'modules'), 'node_modules' ],
		alias: {
			react: 'isomorphic-jsx'
		}
	},
	resolveLoader: {
		modules: [ path.resolve(__dirname, 'loaders'), 'node_modules' ]	
	}
};
