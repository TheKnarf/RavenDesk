const { dom } = require('isomorphic-jsx');

module.exports = (addAsset) => {
  addAsset('index.html', <html>
    <body>
      <h1> Welcome to your new site built with RavenDesk! </h1>
    </body>
  </html>);

	// This will let GitHub Pages know that it's not an Jekyll page
	// ref: https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/
	addAsset('.nojekyll', '');

	// For Github Pages you can set a custom CNAME record
	// see: https://help.github.com/en/articles/using-a-custom-domain-with-github-pages
	//addAsset('CNAME', 'your-domain.com');
};
