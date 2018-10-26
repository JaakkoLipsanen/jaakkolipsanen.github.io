import * as React from 'react'
import styled from 'styled-components'

const TripStatsTitleText = styled.span`
	display: block;
	text-align: center;
	padding-top: 16px;
	font-size: 20px;
`

const TripStatsItemText = styled.span`
	font-size: 30px;
	font-weight: 500;

	margin: 8px 20px;
`

const TripStatsItemSubtext = styled.small`
	font-weight: 300;
	font-size: 0.66em;
`

const TripStatsItem = (props: { count: number; text: string }) => (
	<TripStatsItemText>
		{props.count}
		<TripStatsItemSubtext> {props.text}</TripStatsItemSubtext>
	</TripStatsItemText>
)

const TripStatsItemsContainer = styled.div`
	width: 100%;
	margin: auto;
	display: flex;
	justify-content: center;
`

export type TripStats = {
	trips: number
	countries: number
	kilometers: number
}

export const TripStats = ({ trips, countries, kilometers }: TripStats) => (
	<div>
		<TripStatsTitleText>project #worldbybike</TripStatsTitleText>
		<TripStatsItemsContainer>
			<TripStatsItem count={trips} text="trips" />
			<TripStatsItem count={countries} text="countries" />
			<TripStatsItem count={kilometers} text="kilometers" />
		</TripStatsItemsContainer>
	</div>
)
