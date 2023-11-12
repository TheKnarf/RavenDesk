import { dom } from 'isomorphic-jsx';

export default ({ href, rel, type }) =>
	<link rel={rel} type={type} href={href} />
