import { dom } from 'isomorphic-jsx';

export default ({ title, summary, author, children }) => <entry>
	<title>{title}</title>	
	<summary>{summary}</summary>
	<content type="xhtml">
	{ children }
	</content>
	<author>
		<name>{ author.name }</name>
		<email>{ author.email }</email>
	</author>
</entry>;
