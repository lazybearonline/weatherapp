String.prototype.ucfirst = function() { return this.charAt(0).toUpperCase() + this.slice(1); }

"use strict";

var WeatherApp = (function( $, window, document, undefined ) {

    var _sorted;

    var node = document.getElementById( "WeatherApp" );

    var _settings = {
        api : "http://api.openweathermap.org/data/2.5/",
        ext : "group/"
    }

    var _cities = [];

    var _init = function( cities ) {

        _cities = cities;

        _fetch(function() {
            _events();
        });

    }

    var _menu = function ( refresh ) {

        var row, city, temperature;

        $(".menu tbody", node).empty();

        for (var i = 0; i < _cities.length; i++) {

            var _temperature = parseInt(_cities[i].main.temp);

            row = _new("tr");
            row.setAttribute("data-index", i);

            city = _new("td");
            temperature = _new("td");

            city.innerHTML = _cities[i].name;
            temperature.innerHTML = _temperature + " &deg;C";

            row.appendChild(city);
            row.appendChild(temperature);

            $(".menu > table > tbody", node).append(row);

        }

        $(".menu td", node).on("click", function() {
            _display($(this).parent().data('index'), function() {
                $('.main .content', node).slideToggle();
                $('.menu-icon', node).toggle();
            });
        });

        if (refresh) _display(0);

    }

    var _sort = function (direction, callback) {

        var data = [];

        $(".menu th div", node).removeClass(direction);

        if (_sorted === "asc") {

            _cities.sort(function(a, b) {
                return (a.main.temp < b.main.temp) ? 1 : -1
            });

            _sorted = "desc";
        } else {

            _cities.sort(function(a, b) {
                return (a.main.temp > b.main.temp) ? 1 : -1
            });

            _sorted = "asc";
        }

        $(".menu th div", node).addClass(_sorted);

        if (typeof callback === "function") callback();

    }

    var _populate = function() {

        _sort("asc", function() {
            _menu(true);
        });

    }

    var _new = function ( tag ) { return document.createElement( tag ); }

    var _fetch = function( callback ) {

        $.ajax({
            url : _settings.api + _settings.ext,
            data : {
                id : _cities.join(","),
                units : "metric"
            },
            success : function(data) {

                for (var i = 0; i < _cities.length; i++) {
                    _cities[i] = data.list[i];
                    _cities[i].timestamp = new Date().getTime();
                }

                _populate();

            },
            complete : function() {
                if (typeof callback === "function") callback();
            }
        });

    }

    var _events = function() {

        $(".menu-icon", node).on("click", function() {

            $('.main .content', node).slideToggle({
                duration : 600,
                easing : "easeOutCirc"
            });
            $('.menu-icon', node).toggle();
        });

        $(".menu th:nth-child(2)", node).on("click", function() {
            var sort = $(this).html().toLowerCase();
            _sort(_sorted, function() {
                _menu();
            });
        });

    }

    var _animate = function (from, to, callback) {

        $({ val : from }).animate({ val : to }, {
            duration : 500,
            easing : "swing",
            step : function() {
                callback(this.val);
            }
        });
    }

    var _display = function (index, callback) {

        var data = _cities[index];

        $(".info .temperature", node).html(parseInt(data.main.temp));
        $(".info .temperature-low", node).html(parseInt(data.main.temp_min));
        $(".info .temperature-high", node).html(parseInt(data.main.temp_max));
        $(".info .city", node).html(data.name);
        $(".info .longitude", node).html(data.coord.lon);
        $(".info .latitude", node).html(data.coord.lat);

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

            _animate($(".pressure span", "#blocks").html(), data.main.pressure, function(i) {
                $(".pressure span", "#blocks").html(parseInt(i));
            });

            _animate($(".humidity span", "#blocks").html(), data.main.humidity, function(i) {
                $(".humidity span", "#blocks").html(parseInt(i));
            });

            $("img", "#blocks").fadeIn(400);
        });

        if (typeof callback === "function") callback();

    }

    var app = { init : _init }

    return app;

})( jQuery, window, document, undefined );

WeatherApp.init([2643743,2643123,2655603,2643339]);
