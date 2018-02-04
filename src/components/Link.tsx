import * as React from 'react';
import history from '../history';

type LinkProps = { children: JSX.Element[], href: string };
const Link = (props: LinkProps) => (
	<a {...props} onClick={e => (e.preventDefault(), history.push(props.href))}>
		{props.children}
	</a>
);

export default Link;