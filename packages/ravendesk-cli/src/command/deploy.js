const { setupCompiler } = require('../helpers/compiler.js'),
		WebpackGitPlugin = require('webpack-git-deploy');

const action = async (cmd) => {
	if(!cmd.packfile) {
		return console.log('ravendesk deploy is yet to be implemented, use the package gh-pages in the mean time');
	}
	
	try {
		const compiler = await setupCompiler(cmd.mode);
		if(!compiler) return;

		( new WebpackGitPlugin({
			author: {
				name: 'RavenDesk',
				email: 'norepy@ravendesk.js.org'
			}
		}) ).apply(compiler);

		compiler.run((err, stats) => {
			if (err) {
				console.error(err.stack || err);
				if (err.details) {
					console.error(err.details);
				}
				return;
			}
		});
	} catch(e) {
		console.error(e);
	}

};

module.exports = program =>
	program
		.command('deploy')
		.option('-p, --packfile', 'Experimental: output build as packfile', false)
		.action(action);
