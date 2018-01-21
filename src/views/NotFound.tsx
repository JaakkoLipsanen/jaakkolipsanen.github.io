import * as React from 'react';
import styled from 'styled-components';

const Centered = styled.h1`
	margin: 0;
	height: 100vh;
	
	display: flex;
	text-align: center;
	justify-content: center;
	flex-direction: column;
`;

export default () => <Centered>404</Centered>;