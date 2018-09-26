function Extractor(options) {
	if(typeof options !== 'undefined' && typeof options.filename !== 'undefined')
		this.filename = options.filename;
}

Extractor.prototype.apply = function(compiler) {
	compiler.plugin('emit', (compilation, callback) => {

		if(typeof this.filename !== 'undefined' &&
			typeof compilation['assets'][this.filename] !== 'undefined') {

			const filelist = eval(
					compilation['assets'][this.filename].source()
			);

			if(typeof filelist.length == 'number') {

				filelist.forEach( ({ route, content }) => {
					compilation.assets[route] = {
						source: () => content,
						size: () => content.length
					}
				});

			} else {

				for(var filename in filelist) {
					((f, c) => {
						compilation.assets[f] = {
							source: () => c,
							size: () => c.length
						}
					})(filename, filelist[filename]);
				}

			}

			delete compilation['assets'][this.filename];
		}
		
		callback();
	});	
};

module.exports = Extractor;
