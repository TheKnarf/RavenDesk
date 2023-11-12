import { dom } from 'isomorphic-jsx';
import Feed from './feed';
import Entry from './entry';

// TODO:
//   - What are Atom id's? How do I genenrate them?
//   - How do I format dates?
//   - Which properties are optional, and which are not?
//   - Need to add tests

export const Feed = ({ title }) =>
	<link href="atom.xml" type="application/atom+xml" rel="alternate" title={title} />

export const atomSetup = (addAsset, config, entries) => {
	addAsset(
		'atom.xml',
		<Feed {...config}>
		{entries.map( entry =>
			<Entry {...entry} />
		)}
		</Feed>
	);
}
