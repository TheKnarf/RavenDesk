import { dom } from 'isomorphic-jsx';

export default ({ title, subtitle, children }) =>
	'<?xml version="1.0" encoding="utf-8"?>' +
	<feed xmlns="http://www.w3.org/2005/Atom">
		<title>{title}</title>
		<subtitle>{title}</subtitle>
		<updated>{/* maybe use new Data() to get updated time? */}</updated>
		{children}
	</feed>;
