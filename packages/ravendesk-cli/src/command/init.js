const async = require('../helpers/async.js');
const { ravendesk_folder, config_file, webpack_config_file } = require('../config.js');
const gitignore = require('../asset/default-gitignore.js');

const action = async (workspace, cmd) => {
	if(typeof workspace !== 'undefined')
		return console.log('Command `init` does not support workspaces yet');

	if(!(await async.fileExists('./package.json')))
		return console.error('Can\'t find package.json, run npm init first');

	if(await async.fileExists(ravendesk_folder))
		return console.error(`Can't initialize when folder ${ravendesk_folder} allready exists`);

	console.log('Initializing RavenDesk repo:');

	console.log(`- ${ravendesk_folder}`);
	await async.mkdir(ravendesk_folder);

	console.log(`- ${config_file}`);
	async.writeFile(config_file, `const { dom } = require('isomorphic-jsx');

module.exports = (addAsset) => {
  addAsset('index.html', <html>
    <body>
      <h1> Welcome to your new site built with RavenDesk! </h1>
    </body>
  </html>);

	// This will let GitHub Pages know that it's not an Jekyll page
	// ref: https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/
	addAsset('.nojekyll', '');

	// For Github Pages you can set a custom CNAME record
	// see: https://help.github.com/en/articles/using-a-custom-domain-with-github-pages
	//addAsset('CNAME', 'your-domain.com');
};`);

	if(typeof cmd.preset !== 'undefined') {
		console.log(`- ${webpack_config_file}`);
		async.writeFile(webpack_config_file, `module.exports = require('${cmd.preset}');`);	
	}

	if(await async.fileExists('.gitignore')) {
		console.log('.gitignore allready exists');
	} else {
		console.log(`- .gitignore`);
		async.writeFile('.gitignore', gitignore);
	}

	// TODO: also update package.json with dependecies and build scripts
};

module.exports = program =>
	program
		.command('init [workspace]')
		.option('-p, --preset <preset>', 'Initialize based on a preset')
		.option('-e, --with-examples', 'Adds examples when initializing')
		.action(action);
