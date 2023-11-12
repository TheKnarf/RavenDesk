const middleware = require('webpack-dev-middleware'),
		express = require('express'),
		FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'),
		http = require('http'),
		path = require('path'),
		vhost = require('vhost');

const { setupCompiler } = require('../helpers/compiler.js');

const handle404 = (compiler) => (req, res) => {
	res.status(404);
	res.set('content-type','text/html');

	const filename = path.join(compiler.outputPath,'404.html');
	compiler.outputFileSystem.readFile(filename, (err, result) => {
		if(err) {
			console.error(`Can't find custom 404.html page, just send plain 404 page`);
			res.send('<h1>404</h1>');
		} else {
			res.send(result);
		}

		res.end();
	});
}

const action = async (workspace, cmd) => {
	if(typeof workspace !== 'undefined')
		return console.log('Command `dev` does not support workspaces yet');

	const compiler = await setupCompiler(cmd.mode);
	if(!compiler) return;

	const app = express();

	let hostname = 'localhost';
	if(cmd.hostname) {
		app.use( vhost(cmd.hostname, middleware(compiler, { quiet: true, logLevel: 'silent', }) ));
		app.use( vhost(cmd.hostname, handle404(compiler) ));
		hostname = cmd.hostname;
	} else {
		app.use( middleware(compiler, { quiet: true, logLevel: 'silent', }) );
		app.use( handle404(compiler) );
	}
	
	let port = cmd.port;
	const server = http.createServer(app);
	server.on('error', (e) => {
		if (e.code === 'EADDRINUSE') {
			setTimeout(() => {
				port++;
				if(port > cmd.port + 10) {
					port = 0;
				}
				console.log(`Address in use, retrying with port ${port}...`);
				server.close();
				server.listen(port);
				console.log(`Server on http://${hostname}:${port}/`);
			}, 1000);
		}
	});
	server.listen(port);

	// TODO: need to update the compilation message if the port changes because it's allready taken
	const message = port == 80
					  ? `Ravendesk dev server at http://${hostname}/`
					  : `Ravendesk dev server at http://${hostname}:${port}/`;

	(new FriendlyErrorsWebpackPlugin({
		compilationSuccessInfo: {
			messages: [ message ]
		}
	})).apply(compiler);
};

module.exports = (program) =>
	program
		.command('dev [workspace]')
		.option('-m, --mode <mode>', 'production vs development build', 'development')
		.option('-p, --port <port>', 'port to run the devserver on', 3000)
		.option('-h, --hostname <host>', 'hostname to bind the devserver on')
		.action(action);
