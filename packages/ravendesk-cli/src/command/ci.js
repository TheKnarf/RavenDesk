const action = () => {
	console.log('ci, to be implemented');
	// TOOD: check if PR or not
	//        - if PR then run tests and build
	//        - if not PR run test and build, and then deploy
};

module.exports = program =>
	program
		.command('ci')
		.action(action);
