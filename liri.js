require("dotenv").config();
//calls for javascript file with keys
//which calls for .env file with ID & secret
var keys = require("./keys.js");
//calls for Spotify API
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//calls for axios
var axios = require("axios");
//dependency for write/read files npm
var fs = require("fs");
//dependency for moment npm (time)
var moment = require("moment");

  //inputs variable
  var userInput = process.argv[3];
  var commandInput = process.argv[2];

    //Commands
    switch (commandInput) {
      case "concert-this":
        findBand(userInput);
        break;

      case "spotify-this-song":
        findSong(userInput);
        break;
        
      case "movie-this":
        findMovie(userInput);
        break;

      case "do-what-it-says":
        random();
        break;

      default:
        console.log("Command options: \nconcert-this(artist/band name), \nspotify-this-song(song name), \nmovie-this(movie name), \ndo-what-it-says");
        break;
    }

    //Spotify API
    function findSong(songName) {
      //default song "The Sign" by Ace of the Base 
      if (!songName) {
        songName = "The Sign Ace of the Base";
      }
      spotify
      .search({ type: 'track', query: songName, }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name + 
        "\nSong Name: " + data.tracks.items[0].name + 
        "\nLink: " + data.tracks.items[0].external_urls.spotify + 
        "\nAlbum Name: " + data.tracks.items[0].album.name); 
      })
    };

    //OMDB API
    function findMovie(movieName) {
      //default movie "Mr. Nobody"
      if (!movieName) {
        movieName = "Mr. Nobody";
      }
      // Then run a request with axios to the OMDB API with the movie Name specified
      var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
      // Creating a request with axios to the queryUrl
        axios.get(queryUrl).then(
          function(OMBDresponse) {
            console.log("Title of the Movie: " + OMBDresponse.data.Title +
            "\nRelease Year: " + OMBDresponse.data.Year +
            "\nIMDB Rating: " + OMBDresponse.data.imdbRating +
            "\nRotten Tomatoes Rating: " + OMBDresponse.data.Ratings[1].Value +
            "\nContry of Production: " + OMBDresponse.data.Country +
            "\nLanguage: " + OMBDresponse.data.Language +
            "\nPlot: " + OMBDresponse.data.Plot +
            "\nActors: " + OMBDresponse.data.Actors);
        })
    };

    //Bands in Town API
    function findBand(bandName) {
      // Then run a request with axios to the Bands in Town API with the band Name specified
      var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(
          function(BITresponse) {
            console.log("Venue Name: " + BITresponse.data[0].venue.name +
            "\nVenue Location: " + BITresponse.data[0].venue.country +
            "\nEvent Date: " + moment(BITresponse.data[0].datetime).format("MM/DD/YYYY"));
        })
    };

    //read the file random.txt
    function random() {
      fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        // We will then re-display the content 
        findSong(dataArr[1]);
      })
    };
