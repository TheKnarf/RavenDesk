const printTable = (arrayOfObjects, mapHeaders = id => id) => {
	if(arrayOfObjects.length < 1) return;

	const logWithPadding = padding =>
		(...data) => {
			const updatedData = data.map(d => {
				const l = padding - ('' + d).length;
				return `${d}${' '.repeat(l>0?l:0)}`
			});
			console.log(...updatedData);
		};

	const log_ = logWithPadding(30);

	const headers = Object.keys(arrayOfObjects[0]);
	log_(...(headers.map(mapHeaders)));
	console.log();

	arrayOfObjects
		.map(obj => headers.map(header => obj[header]))
		.forEach(obj => log_(...obj));
};

module.exports = {
	printTable,
};
