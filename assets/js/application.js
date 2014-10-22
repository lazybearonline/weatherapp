/*********************************/
/* Easing borrowed from jQueryUI */
/*-------------------------------*/

(function() {

    var baseEasings = {};

    $.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
        baseEasings[ name ] = function( p ) {
            return Math.pow( p, i + 2 );
        };
    });

    $.extend( baseEasings, {
        Sine: function( p ) {
            return 1 - Math.cos( p * Math.PI / 2 );
        },
        Circ: function( p ) {
            return 1 - Math.sqrt( 1 - p * p );
        },
        Elastic: function( p ) {
            return p === 0 || p === 1 ? p :
                -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
        },
        Back: function( p ) {
            return p * p * ( 3 * p - 2 );
        },
        Bounce: function( p ) {
            var pow2,
                bounce = 4;

            while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
            return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
        }
    });

    $.each( baseEasings, function( name, easeIn ) {
        $.easing[ "easeIn" + name ] = easeIn;
        $.easing[ "easeOut" + name ] = function( p ) {
            return 1 - easeIn( 1 - p );
        };
        $.easing[ "easeInOut" + name ] = function( p ) {
            return p < 0.5 ?
                easeIn( p * 2 ) / 2 :
                1 - easeIn( p * -2 + 2 ) / 2;
        };
    });

})();

(function( $, window, document, undefined ) {

    "use strict";

    function WeatherApp(node) {
        this.node = node;
        this.$node = $(node);

        $.extend(this, {
            _cities : [
                {
                    id : 2643743,
                    name : "London"
                },{
                    id : 2643123,
                    name : "Manchester"
                },{
                    id : 2655603,
                    name : "Birmingham"
                },{
                    id : 2643339,
                    name : "Luton"
                }]
        });

        this._init();
    }

    WeatherApp.prototype = {

        _init : function() {
            var self = this;
            this._fetch(function() {
                self._events();
            });
        },

        _fetch : function (callback) {

            var self = this;

            var api = "http://api.openweathermap.org/data/2.5/";
            var url = "group/";
            var data = { id : this._cities[0].id };
            var ids = [];

                for (var i = 0; i < this._cities.length; i++) {
                    ids.push(this._cities[i].id);
                }

                data.id = ids.join();

                data.units = "metric";

            $.ajax({
                url : api + url,
                data : data,
                success : function(data) {

                    for (var i = 0; i < self._cities.length; i++) {
                        self._cities[i] = data.list[i];
                        self._cities[i].timestamp = new Date().getTime();
                    }

                    self._populate();

                },
                complete : function() {
                    if (typeof callback === "function") callback();
                }
            });
        },

        _populate : function() {
            var self = this;
            this._sort("asc", function() {
                self._menu(true);
            });
        },

        _menu : function (refresh) {

            var self = this;
            var row, city, temperature;

            $(".menu tbody", this.node).empty();

            for (var i = 0; i < this._cities.length; i++) {

                var _temperature = parseInt(this._cities[i].main.temp);

                row = this._new("tr");
                row.setAttribute("data-index", i);

                city = this._new("td");
                temperature = this._new("td");

                city.innerHTML = this._cities[i].name;
                temperature.innerHTML = _temperature + " &deg;C";

                row.appendChild(city);
                row.appendChild(temperature);

                $(".menu > table > tbody", this.node).append(row);

            }

            $(".menu td", this.node).on("click", function() {
                self._display($(this).parent().data('index'), function() {
                    $('.main .content', self.node).slideToggle();
                    $('.menu-icon', self.node).toggle();
                });
            });

            if (refresh) this._display(0);

        },

        _sort : function (direction, callback) {

            var data = [];

            $(".menu th div", this.node).removeClass(direction);

            if (this._sorted === "asc") {

                this._cities.sort(function(a, b) {
                    return (a.main.temp < b.main.temp) ? 1 : -1
                });

                this._sorted = "desc";
            } else {

                this._cities.sort(function(a, b) {
                    return (a.main.temp > b.main.temp) ? 1 : -1
                });

                this._sorted = "asc";
            }

            $(".menu th div", this.node).addClass(this._sorted);

            if (typeof callback === "function") callback();

        },

        _animate : function (from, to, callback) {

            $({ val : from }).animate({ val : to }, {
                duration : 500,
                easing : "swing",
                step : function() {
                    callback(this.val);
                }
            });
        },

        _new : function (tag) { return document.createElement(tag); },

        _events : function() {

            var self = this;

            $(".menu-icon", this.node).on("click", function() {
                $('.main .content', self.node).slideToggle({
                    duration : 600,
                    easing : "easeOutCirc"
                });
                $('.menu-icon', self.node).toggle();
            });

            $(".menu th:nth-child(2)", this.node).on("click", function() {
                var sort = $(this).html().toLowerCase();
                self._sort(self._sorted, function() {
                    self._menu();
                });
            });

        },

        _display : function (index, callback) {

            var self = this;
            var data = this._cities[index];

            $(".info .temperature", this.node).html(parseInt(data.main.temp));
            $(".info .temperature-low", this.node).html(parseInt(data.main.temp_min));
            $(".info .temperature-high", this.node).html(parseInt(data.main.temp_max));
            $(".info .city", this.node).html(data.name);
            $(".info .longitude", this.node).html(data.coord.lon);
            $(".info .latitude", this.node).html(data.coord.lat);

            $("img", "#blocks").fadeOut(200, function() {
                $(".weather-icon img", "#blocks").attr("src", "/assets/img/" + data.weather[0].icon + ".svg");
                $(".weather-icon p", "#blocks").html(data.weather[0].main);

                var temp = "cold";
                if (data.main.temp > 10) temp = "mild";
                else if (data.main.temp > 20) temp = "moderate";
                else if (data.main.temp > 30) temp = "warm";
                else if (data.main.temp > 40) temp = "hot";

                $(".temperature-icon img", "#blocks").attr("src", "/assets/img/temp-" + temp + ".svg");
                $(".temperature-icon p", "#blocks").html(temp.ucfirst());

                self._animate($(".pressure span", "#blocks").html(), data.main.pressure, function(i) {
                    $(".pressure span", "#blocks").html(parseInt(i));
                });

                self._animate($(".humidity span", "#blocks").html(), data.main.humidity, function(i) {
                    $(".humidity span", "#blocks").html(parseInt(i));
                });

                $("img", "#blocks").fadeIn(400);
            });

            if (typeof callback === "function") callback();

        }

    }

    $(document).ready(function() {

        String.prototype.ucfirst = function() { return this.charAt(0).toUpperCase() + this.slice(1); }

        var app = document.getElementById("WeatherApp");
        $(app).data("weather", new WeatherApp(app));

    });

}( jQuery, window, document, undefined ));
