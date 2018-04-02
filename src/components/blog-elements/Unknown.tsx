import * as React from 'react';
import { BlogPostElement } from '../../blog';

export default (props: { element: BlogPostElement}) => 
	<span style={{ color: 'red' }}>Unrecognized element type: {props.element.type}</span>;