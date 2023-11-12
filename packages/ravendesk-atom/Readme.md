# Ravendesk Atom

A reusable package for adding [Atom feeds](https://tools.ietf.org/html/rfc4287) to your RavenDesk powered webpage.

```
npm i --save-dev @ravendesk/atom
```

## Usage
There are two pieces you need to set this up with your website.

1. First you need to add the atom feed to your header as following:

```
import { Feed } from '@ravendesk/atom';

const Head = () => <head>
	{/* ... other content that goes in a header ... */}
	<title>Your webpage title</title>
	<Feed title="Your webpage title" />
</head>

export default Head;
```

2. Second you need to add it too `.ravendesk/config.js`:

```
const { dom } = require('isomorphic-jsx');
const { atomSetup } = require('@ravendesk/atom');

module.exports = (addAsset) => {
	// ... other config code ...

	const blogPosts = [ /* ... your blog posts data goes here ... */ ];

	atomSetup(addAsset, {
		title: 'Your webpage title',
		subtitle: 'Webpage subtitle',
	}, blogPosts);
};
```

You can see a full example in the `examples/` directory.
