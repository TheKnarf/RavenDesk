const { setupCompiler } = require('../helpers/compiler.js');

const action = async (workspace, cmd) => {
	if(typeof workspace !== 'undefined')
		return console.log('Command `build` does not support workspaces yet');

	try {
		console.log("RavenDesk building");

		const compiler = await setupCompiler(cmd.mode);
		if(!compiler) return;

		compiler.run((err, stats) => {
			if (err) {
				console.error(err.stack || err);
				if (err.details) {
					console.error(err.details);
				}
				return;
			}

			const info = stats.toJson();

			if (stats.hasErrors()) {
				console.error(info.errors);
			}

			if (stats.hasWarnings()) {
				console.warn(info.warnings);
			}
			console.log('Compiled');
		});
	} catch(e) {
		console.error(e);
	}
};

module.exports = (program) =>
	program
		.command('build [workspace]')
		.option('-l, --lib', 'build as a library', false)
		.option('-m, --mode <mode>', 'production vs development build', 'production')
		.action(action);
