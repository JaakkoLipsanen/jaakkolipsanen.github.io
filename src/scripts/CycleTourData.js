
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
			"name": "Sweden to Belgium '14",
			"shortName": "EUROPE 2014",
			"year": "2014",
			"description": ""
		},

		{
			"name": "Spain December '14",
			"shortName": "SPAIN 2014",
			"year": "2014",
			"description": ""
		},

		{
			"name": "Western and Central Europe '15",
			"shortName": "EUROPE 2015",
			"year": "2015",
			"description": ""
		},

		{
			"name": "Western USA '16",
			"shortName": "USA 2016",
			"year": "2016",
			"description": ""
		},
	]
};
