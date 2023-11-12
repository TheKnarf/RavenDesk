const async = require('../helpers/async.js');
const { webpack_config_file } = require('../config.js');
const { minimalWebpackConfig, setupWebpackConfig } = require('../helpers/compiler');

const action = async (cmd) => {
	// TODO: fix printout bugs here.
	//       JSON.stringify can't print regex's and functions
	if(!!cmd.minimal) {
		console.log('PS. json.stringify doesn\'t print out functions and therefor plugins seems empty');
		console.log(
			JSON.stringify(
				minimalWebpackConfig(),
				null,
				2
			)
		);
	} else {
		console.log(
			'RavenDesk sets up a minimal Webpack config,',
			`\nthen it looks for a ${webpack_config_file} that may modify the config if needed.`,
			"\nIf you only wanted to see the minimal webpack setup run this comand with the --minimal flag."
		);
		
		if(await async.fileExists(webpack_config_file)) {
			console.log(`\n${webpack_config_file} found\n`);
		} else {
			console.log(`\n${webpack_config_file} not found\n`);
		}

		console.log('PS. json.stringify doesn\'t print out functions and therefor plugins seems empty');

		console.log(
			JSON.stringify(
				await setupWebpackConfig('production'),
				null,
				2
			)
		);
	}
};

module.exports = program =>
	program
		.command('webpack-config-debug')
		.option('-m, --minimal', 'show minimal webpack config', false)
		.action(action);
