import * as React from 'react'
import styled from 'styled-components'

import { Trip } from '../api/trip'

const TripSelectContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: auto;
`

type TripSelectButtonProps = { selected: boolean }
const TripSelectButton = styled.button<TripSelectButtonProps>`
	appearance: none;
	outline: none;
	border: none;

	display: flex;
	justify-content: center;
	min-height: 2em;
	cursor: pointer;
	margin-top: -1px; /* make borders overlap so that no double borders */
	margin-left: -1px;

	border: 1px solid darkgray;

	&:first-child {
		border-radius: 5px 0 0 5px;
	}

	&:last-child {
		border-radius: 0px 5px 5px 0px;
	}

	background-color: white;
	${({ selected }) =>
		selected &&
		`
		background-color: lightgray;
	`};
`

type TripSelectorProps = {
	trips: ReadonlyArray<Trip>
	selectedTripShortName?: string
	changeSelectedTrip: (shortName?: string) => void
}

export const TripSelector = ({
	trips,
	selectedTripShortName,
	changeSelectedTrip
}: TripSelectorProps) => (
	<TripSelectContainer>
		{trips.map(trip => (
			<TripSelectButton
				selected={selectedTripShortName === trip.shortName}
				onClick={changeSelectedTrip.bind(
					null,
					selectedTripShortName === trip.shortName
						? undefined
						: trip.shortName
				)}
			>
				{trip.shortName}
			</TripSelectButton>
		))}
	</TripSelectContainer>
)
