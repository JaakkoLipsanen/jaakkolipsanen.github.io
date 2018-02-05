import * as React from 'react';
import styled, { css } from 'styled-components';
import withProps from 'styled-components-ts';

import history from '../history';
import paths from '../paths';

type Link = { name: string, url: string, enabled: boolean };
const links: Link[] = [
	{ name: 'home', url: paths.home, enabled: true },
	{ name: 'blog', url: paths.blogList, enabled: true },
	{ name: 'gear', url: paths.gear, enabled: false },
	{ name: 'tours', url: paths.tours, enabled: true }
];

const NavContainer = styled.div`
	display: grid;
	height: 118px;

	background-color: white;
`;

const NavLinksContainer = styled.div`
	align-self: center;
	align-content: center;
	text-align: center;
`;

type NavLinkProps = { selected: boolean, enabled: boolean };
const NavLink = withProps<NavLinkProps>(styled.a)`
	font-size: 20px;
	font-weight: 600;

	text-decoration: none;
	color: black;
	opacity: ${props => props.enabled ? 1 : 0.4};
	border-bottom: 2px solid ${props => props.selected ? 'black' : 'transparent'};
	transition: border-bottom 0.3s;

	pointer-events: ${props => props.enabled ? 'inherit' : 'disabled'};
	margin: 0px 32px;
	padding: 3px 1px;

	&:hover {
		${props => (props.enabled && !props.selected)
			? css` border-bottom: ${props.selected ? 'inherit' : '2px solid rgba(0, 0, 0, 0.5)'};`
			: ''
		};
	}
`;

const Link = (props: { link: Link, selected: boolean }) => (
	<NavLink 
		href={`/${props.link.name}`} 
		selected={props.selected} 
		enabled={props.link.enabled}
		onClick={e => { e.preventDefault(); history.push(`${props.link.url}`); }}
	>
		{props.link.name.toUpperCase()}
	</NavLink>
);

const isLinkSelected = (link: Link) => (link.url === '/')
	? history.location.pathname === '/'
	: history.location.pathname.startsWith(link.url);

class Navbar extends React.Component {
	render() {
		return (
			<NavContainer>
				<NavLinksContainer>
					{links.map(link => <Link key={link.name} link={link} selected={isLinkSelected(link)} />)}
				</NavLinksContainer>
			</NavContainer>
		);
	}
}

export default Navbar;