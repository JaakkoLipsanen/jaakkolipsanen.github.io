
export const CycleTourData = {
	Tours: [
		{
			"name": "Sweden to Belgium",
			"shortName": "Europe 2014",
			"year": "2014",
			"description": ""
		},

		{
			"name": "Spain Winter",
			"shortName": "Spain 2014",
			"year": "2014",
			"description": ""
		},

		{
			"name": "Central Europe",
			"shortName": "Europe 2015",
			"year": "2015",
			"description": ""
		},

		{
			"name": "Western USA",
			"shortName": "USA 2016",
			"year": "2016",
			"description": ""
		},
		{
			"name": "Israel & Jordan",
			"shortName": "Israel & Jordan 2016",
			"year": "2016",
			"description": ""
		}
	],

	GetAllShortNames: function() { // from oldest to newest
		return this.Tours.map(tour => tour.shortName);
	},

	GetAllNames: function() { // from oldest to newest
		return this.Tours.map(tour => tour.name);
	},

	GetTourByShortName: function(shortName) {
		return this.Tours.find(x => x.shortName === shortName);
	},

	GetAllTours: function() {
		return this.Tours;
	}
};
