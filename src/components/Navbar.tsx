import * as React from 'react';
import styled, { css } from 'styled-components';
import withProps from 'styled-components-ts';

import history from '../history';
import paths from '../paths';

const NAVBAR_HEIGHT = 118;
type Link = { name: string, url: string, enabled: boolean };
const links: Link[] = [
	{ name: 'home', url: paths.home, enabled: true },
	{ name: 'blog', url: paths.blogList, enabled: true },
	{ name: 'gear', url: paths.gear, enabled: false },
	{ name: 'tours', url: paths.tours, enabled: true }
];

type NavContainerProps = { shrink: boolean };
const NavContainer = withProps<NavContainerProps>(styled.div)`
	display: grid;
	position: fixed;
	top: 0px;
	width: 100%;
	height: ${props => props.shrink ? '40px' : `${NAVBAR_HEIGHT}px`};
	font-size: ${props => props.shrink ? '16px' : '20px'};

	background-color: white;
	z-index: 1;

	transition: height 0.3s, font-size 0.3s;
`;

const NavTakeSpace = styled.div`
	height: ${NAVBAR_HEIGHT}px;
`;

const NavLinksContainer = styled.div`
	align-self: center;
	align-content: center;
	text-align: center;
`;

type NavLinkProps = { selected: boolean, enabled: boolean };
const NavLink = withProps<NavLinkProps>(styled.a)`
	font-weight: 600;

	text-decoration: none;
	color: black;
	opacity: ${props => props.enabled ? 1 : 0.4};
	border-bottom: 2px solid ${props => props.selected ? 'black' : 'transparent'};
	transition: border-bottom 0.3s;

	pointer-events: ${props => props.enabled ? 'inherit' : 'none'};
	margin: 0px 32px;
	padding: 3px 1px;

	&:hover {
		${props => (props.enabled && !props.selected)
			? css`border-bottom: 2px solid rgba(0, 0, 0, 0.5);`
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

interface NavbarState { shrink: boolean; }
class Navbar extends React.Component<{}, NavbarState> {
	state = {
		shrink: false,
	};

	handleScroll = () => {
		const shrink = window.scrollY > 0;
		this.setState({ shrink });
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	render() {
		return (
			<>
				<NavContainer shrink={this.state.shrink}>
					<NavLinksContainer>
						{links.map(link => <Link key={link.name} link={link} selected={isLinkSelected(link)} />)}
					</NavLinksContainer>
				</NavContainer>
				<NavTakeSpace />
			</>
		);
	}
}

export default Navbar;