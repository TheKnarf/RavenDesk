const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

module.exports = ({ config, mode }) => {
	config.target = 'node';
	config.externals = [ require('webpack-node-externals')() ];

	const babelLoader = { loader: 'babel-loader', options: {
		presets: [
			[ require.resolve('@babel/preset-react'), {
				pragma: 'dom',
				pragmaFrag: 'fragment',
				throwIfNamespace: false
			}]
		]
	}};

	config.module.rules = [
		{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [ babelLoader, 'simple-frontmatter-loader' ]
		},
		{
			test: /\.mdx?$/,
			exclude: /node_modules/,
			use: [ babelLoader, 'ravendesk-mdx-loader', 'simple-frontmatter-loader' ]
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
		{
			test: cssModuleRegex,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						modules: true,
					},
				}
			]
		},
		{
			test: cssRegex,
			exclude: cssModuleRegex,
			use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
		},
		{ test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'file-loader' },
	];

	config.plugins.push(new MiniCssExtractPlugin());

	config.resolve = config.resolve || {};
	config.resolve.extensions = ['.js', '.jsx', '.md', '.mdx', '.html'];

	return config;
};
