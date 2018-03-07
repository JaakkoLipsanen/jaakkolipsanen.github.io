import styled from 'styled-components';
import withProps from 'styled-components-ts';

type TakeHeightProps = { height: string };
export const TakeHeight = withProps<TakeHeightProps>(styled.div)`
	height: ${props => props.height};
`;