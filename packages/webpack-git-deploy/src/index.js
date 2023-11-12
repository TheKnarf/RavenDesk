const MemoryFs = require('memory-fs');
const {
	createNewGitRepo,
	modes,
	saveAsBlob,
	saveAsTree,
	saveAsCommit,
	pack,
} = require('./git');

// TODO: how do I unit-/integration-test this?

function WebpackGitDeployPlugin(options) {
	if(typeof options == 'undefined' ||
		typeof options.author == 'undefined' ||
		typeof options.author.name == 'undefined' ||
		typeof options.author.email == 'undefined') {

		throw new Error('Problems setting up WebpackGitDeployPlugin, you need to set option author.name and author.email');
	}

	this.author = options.author;

	if(typeof options.parentCommit !== 'undefined')
		this.parentCommit = options.parentCommit;

	if(typeof options.branch !== 'undefined')
		this.branch = options.branch;

	if(typeof options.commitMessage !== 'undefined') {
		this.commitMessage = options.commitMessage;
	} else {
		this.commitMessage = "Webpack build\n";
	}
}

WebpackGitDeployPlugin.prototype.apply = function(compiler) {
	compiler.outputFileSystem = new MemoryFs();

	compiler.hooks.done.tap('WebpackGitDeployPlugin', async (stats) => {
		let repo = createNewGitRepo(),
			 tree = {},
			 hashes = [];

		// Hash all files as blobs and get file hash's
		await Promise.all(Object
			.keys(stats.compilation.assets)
			.map(async (filename) => {
				const hash = await saveAsBlob(repo, compiler.outputFileSystem.readFileSync(
					stats.compilation.assets[filename].existsAt
				));

				tree[filename] = { mode: modes.file, hash };
				hashes.push(hash);
			})
		);
		
		// Make and save tree
		const treeHash = await saveAsTree(repo, tree);
		hashes.push(treeHash);

		// TODO: this commit should link back to the previus commit
		// 		so I have to figure out where to get that from.
		// 		For now I should probably get it as an option to the plugin,
		// 		and then deal with the problem in ravendesk-cli
		const commitHash = await saveAsCommit(repo, {
			 author: { name: this.author.name, email: this.author.email },
			 tree: treeHash,
			 message: this.commitMessage
		});
		hashes.push(commitHash);
		
		const stream = await pack(repo, hashes);
		// TODO: writing it to stdout might be fine if I'm supposed to pipe it into git-unpack-objects
		//       but the goal is to push it right to the server, so I need to do something else here
		//
		//       I also need to keep track of the commitHash
		function readStream() {
			stream.take((err, data) => {
				if(err) throw err;
				if(data === undefined) return;
				process.stdout.write(data);
				readStream();
			});
		}
		readStream();

	});
};

module.exports = WebpackGitDeployPlugin;
