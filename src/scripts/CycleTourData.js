
export let CycleTourData = {

	GetAllShortNames: function() { // from oldest to newest
		return Tours.map(tour => tour.shortName);
	},

	GetAllNames: function() { // from oldest to newest
		return Tours.map(tour => tour.name);
	},

	GetTourByShortName: function(shortName) {
		return Tours.find(x => x.shortName == shortName);
	},

	GetAllTours: function() {
		return this.Tours;
	},

	Tours: [
		{
			"name": "Sweden to Belgium",
			"shortName": "EUROPE 2014",
			"year": "2014",
			"description": ""
		},

		{
			"name": "Spain Winter",
			"shortName": "SPAIN 2014",
			"year": "2014",
			"description": ""
		},

		{
			"name": "Western and Central Europe",
			"shortName": "EUROPE 2015",
			"year": "2015",
			"description": ""
		},

		{
			"name": "Western USA",
			"shortName": "USA 2016",
			"year": "2016",
			"description": ""
		},
	]
};
