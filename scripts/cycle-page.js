
function initialize() {
    /* TOP MAP STUFF */
    {
        var paintRoute = function (context, route) {
            var mapWidth = context.canvas.width;
            var mapHeight = context.canvas.height;
            var lonToX = function (longitude) {

                // häx!! for some reason, longitude > 0 works pretty much perfectly, but with negative values it doesn't work properly (some values are correct, some are bit wrong)
                if (longitude > 0)
                    return mapWidth / 2 + (longitude / 180 * (mapWidth / 2)) * 0.946;
                else {
                    return mapWidth / 2 + (longitude / 187.480162 * (mapWidth / 2));
                }
            }

            var latToY = function (latitude) {
                var latRad = latitude * Math.PI / 180;
                var mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
                return mapHeight * 0.65131894484 - (mapWidth * mercN / (2 * Math.PI)) * 0.935;
            }

            for (var i = 0; i < route.CyclingPaths.length; i++) {
                var startPoint = route.CyclingPaths[i].Points[0];
                context.moveTo(lonToX(startPoint.lng()), latToY(startPoint.lat()));

                for (var j = 1; j < route.CyclingPaths[i].Points.length; j += 25) {
                    var point = route.CyclingPaths[i].Points[j];
                    context.lineTo(lonToX(point.lng()), latToY(point.lat()));
                }
            }

            for (var i = 0; i < route.TransportPaths.length; i++) {
                var startPoint = route.TransportPaths[i].Points[0];
                context.moveTo(lonToX(startPoint.lng()), latToY(startPoint.lat()));

                for (var j = 1; j < route.TransportPaths[i].Points.length; j++) {
                    var point = route.TransportPaths[i].Points[j];
                    context.lineTo(lonToX(point.lng()), latToY(point.lat()));
                }
            }
        };

        var canvas = document.getElementById("route-canvas");
        var paintCanvas = function () {
            var context = canvas.getContext('2d');

            context.beginPath();
            //	paintRoute(context, europe14);
            //	paintRoute(context, spain14);

            context.lineWidth = 2;
            context.strokeStyle = 'rgb(96, 96, 96)'; // "rgb(172, 32, 32)";
            context.stroke();

        };

        var updateCanvasSize = function () {
            canvas.width = $("#map-img").width();
            canvas.height = $("#map-img").height();

            paintCanvas();
        };
    }

    $(window).resize(updateCanvasSize);
    updateCanvasSize();

    var gallery = new Gallery(document.getElementById("gallery-container"), "scripts/");

    var routeSelectionBinding = new Vue({
        el: '#route-selection-list',
        data: {
            selectedIndex: -1,
            items: [
                {
                    name: "Northern Europe",
                    year: 2014,
                    text: "Yay my first tour it was nice Sweden-Belgium!",
                    route: new RouteView(new Route(new RouteDescription("data/cycle/europe14/route-description.txt"))),
                    gallery: new GallerySource("Europe '14", "data/cycle/europe14/photos")
                },
                {
                    name: "Spain",
                    year: 2014,
                    text: "Wooo very freezing trip! Also super pretty!",
                    route: new RouteView(new Route(new RouteDescription("data/cycle/spain14/route-description.txt"))),
                    gallery: new GallerySource("Spain '14", "data/cycle/spain14/photos")
                },
                {
                    name: "Central Europe", year: 2015,
                    text: "Woo Alps and Pyreenes!",
                    route: new RouteView(new Route(new RouteDescription("data/cycle/europe15/route-description.txt"))),
                    gallery: new GallerySource("Europe '15", "data/cycle/europe15/photos")
                },
            ]},

        methods: {
            // called when route button is clicked
            changeRoute: function(event) {
                this.selectedIndex = $("li").index($(event.currentTarget));
                gallery.AssignSource(this.selectedRoute.gallery);

                $('html, body').animate({
                    scrollTop: $("#route-selection-list").offset().top - 24
                }, 750);
            }
        },

        computed: {
            selectedRoute: function () {
                return this.items[this.selectedIndex];
            }
        }
    });

    new Vue({
        el: "#route-info-container",

        computed: {
            selectedRoute: function () {
                return routeSelectionBinding.items[routeSelectionBinding.selectedIndex];
            },

            isVisible: function() {
                return routeSelectionBinding.selectedIndex >= 0;
            }
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

/* cycle map component TODO: Modularize and move to own file */
Vue.component("cycle-map", {
    props: {
        routeView: Object,
    },

    map: null,
    isMapFullscreen: false,
    watch: {
        'routeView': function(value, oldValue) {
            this.map.SetRoute(value);
        }
    },

    template: "<div id='cycle-map-container'>" +
    "<div style='position: relative; z-index: 10000;'>" +
    "<img class='resize-button fullscreen-button' src='icons/expand.png'  v-on:click='enterFullscreen'  />" +
    "</div>" +

    "<div style='width: 100%; height: 100%' id='cycle-map' ></div>" +
    "<p style=' margin-top: 0px; float: left;'>{{ this.routeView.RouteLength + 'km, ' + this.routeView.NightCount + ' days' }}</p>" +
    "<div style='display: inline; float: right'>" +
    "<img style='width: 10px; display: inline' src='icons/cycle/tent.png'><p style='display: inline'> camping </p> " +
    "<img style='margin-left: 4px; width: 10px; display: inline' src='icons/cycle/hotel.png'><p style='display: inline'> hotel</p> " +
    "</div>" +

    "</div>",

    ready: function() {

        // remove Google logo, copyright print etc from Google Maps. Yeah might not be allowed etc but meh.. :/
        var css = window.document.styleSheets[0];
        css.insertRule(".gmnoprint a, .gmnoprint span, .gm-style-cc { display: none; }", 0);
        css.insertRule(".gmnoprint div { background:none !important; } ", 0);
        css.insertRule("a[href^='http://maps.google.com/maps']{display:none !important} ", 0);
        css.insertRule("a[href^='https://maps.google.com/maps']{display:none !important}", 0);

        this.map = new CycleMap(
            $("#cycle-map").get(0),
            new MapProperties(MapType.Normal, LabelType.Visible));

        if(this.routeView != null) {
            this.map.SetRoute(this.routeView);
        }

        OnFullscreenChange(function() {
            this.isMapFullscreen = !this.isMapFullscreen
            $("#cycle-map-container").toggleClass('fullscreen', this.isMapFullscreen);
            $("#cycle-map-container .fullscreen-button").attr('src', this.isMapFullscreen ? 'icons/reduce.png' : 'icons/expand.png')

            this.map.OnSizeChanged();

        }.bind(this));

        this.map.OnStreetviewVisibileChanged(function(isVisible) {
            // fullscreen button should only show when street view is NOT visible!
            $("#cycle-map-container .fullscreen-button").toggle(!isVisible);

            // without this, is user enters fullscreen in street view, it will mess everything :/
            if(this.isMapFullscreen) {
                ExitFullScreen();
            }
        }.bind(this))
    },

    methods: {
        enterFullscreen: function(event) {
            if(this.isMapFullscreen) {
                ExitFullScreen();
            }
            else {
                EnterFullScreen($("#cycle-map-container").get(0));
            }
        },
    }
});