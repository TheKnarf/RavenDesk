const mdx = require('@mdx-js/mdx');

module.exports = async function(content) {
	const callback = this.async();
	try {
		const result = await mdx(content)
		//console.log(result);

		// TODO: this creates a wrapper component in the html
		//       we'll have to make a custom mdx function that wraps dom
		//       and then strips away the wrapper component.
		const code = `/* @jsx mdx */
import { dom as mdx } from 'isomorphic-jsx';
${result}`;

		return callback(null, code);
	} catch (err) {
		return callback(err)
	}
};
