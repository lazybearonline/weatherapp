Weather Station Test
====================
This test is to create a simple application that can pull data from a web service and display it to the user, it should take no more than a couple of hours.

API
===
Using the [Open Weather Map API](http://www.openweathermap.org/API) you can fetch data for cities around the world.<br>
Everything you need to know about how to call the service and what the data means is on that site.

The problem
===========
Create a simple application that can show the user a selection of UK cities (London, Luton Manchester, and Birmingham). Allow the user to select a city, show the weather information for that city (using the API).

You must display:<br>
* Name of the city
* Location (longitude and latitude)
* The current weather conditions
* Icon for the weather conditions
* The temperate and temperature range
* The current atmospheric pressure
* The current humidity

Implement the following features:<br>
* Ability to sort the cities by temperature in ascending & descending order
* Ability to select any city and display the details as described above
* Once the data has been displayed the user should be able to pick another city if they choose.

Design considerations<br>
* Application of OO design best practises
* Demonstrate separation of concerns
* Well refactored code
* Code should be performant if scaled
