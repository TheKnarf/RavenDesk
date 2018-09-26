import { dom } from 'isomorphic-jsx';

/*function attr_fix(key, value) {
	if(typeof value === 'object') {
		value = Object
			.keys(value)
			.map(key => `${key}:${value[key]}`)
			.join(';');
	}

	return `${key}="${value}"`;
}//*/

export function MDXTag(props) {
  const {
    name,
    parentName,
    props: childProps = {},
    children,
    components = {},
    Layout
  } = props
  const Component = name;

  if (Layout) {
    return <Layout components={components}>
      <Component {...childProps}>{children}</Component>
    </Layout>
  }

  return <Component {...childProps}>{children}</Component>
}

/*
export default function dom(type, attributes, ...children) {
	const attr = Object
		.keys(attributes || {})
		.map(key => attr_fix(key, attributes[key]))
		.join(' ');

	if(typeof type == "function") {
		var props = attributes || {};
		props.components = {};
		props.children = children;
		return type(props);
	}

	return `<${type} ${attr}> ${children.join('')} </${type}>`;
}

export function sls(strings, ...values) {  
	let output = values
		.map((val, i) => strings[i] + val)
		.join('') +
		strings[values.length];

	return output
		.split(/(?:\r\n|\n|\r)/)
		.map(line => line.replace(/^\s+/gm, ''))
		.join(' ')
		.trim();
}
*/
