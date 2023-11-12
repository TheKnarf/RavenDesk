const async = require('../helpers/async.js');
const { printTable } = require('../helpers/table.js');

const action = async () => {
	console.log('Workspaces');	

	if(!(await async.fileExists('./package.json'))) {
		console.error('Can\'t find package.json');
		return;
	}

	const packageJson = JSON.parse(
		await async.readFile('./package.json')
	);

	if(typeof packageJson.workspaces == 'undefined') {
		console.error('No filed called workspaces in package.json');
		return;
	}

	const packages = (await Promise.all(packageJson
		.workspaces
		.map(async (workspace) => await async.glob(workspace))
	)).flatMap(id=>id);

	const isNodeRepo = (await Promise.all(packages
		.map(path => ({ path }))
		.map(async (obj) => {
			const isNodeRepo = await async.fileExists(`${obj.path}/package.json`);
			return { ...obj, isNodeRepo };
		})
	))
		.flatMap(id=>id)
		.filter(({ isNodeRepo }) => isNodeRepo)
		.map(({ isNodeRepo, ...obj }) => obj); //*/

	const isRavenDeskRepo = (await Promise.all(isNodeRepo
		.map(async (obj) => {
			const isRavenDeskRepo = await async.fileExists(`${obj.path}/.ravendesk`);
			return { ...obj, isRavenDeskRepo };
		})
	)).flatMap(id=>id);

	printTable(isRavenDeskRepo, header =>
		header === 'path' ? 'Path' :
		header === 'isNodeRepo' ? 'Contains package.json' :
		header === 'isRavenDeskRepo' ? 'RavenDesk Repo' :
		header
	);
}

module.exports = (program) => {
	program.command('workspaces').action(action);
};
