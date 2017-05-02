(function(ext) {

    var clarifai = undefined;
    var clarifaiLoaded = false;
    var predictionResults = [];

    $.getScript('https://eesh.github.io/scratch-test/clarifai.js', checkClarifai);

    function checkClarifai() {
      if(Clarifai === undefined) {
        console.log("Clarifai not loaded");
        clarifaiLoaded = false;
      } else {
        clarifaiLoaded = true;
      }
    }

    function initialiseClarifai(apikey1, apikey2) {
      var clarifai = new Clarifai.App(apikey1, apikey2);
      if (clarifai == undefined) {
        clarifaiLoaded = false;
      } else {
        clarifaiLoaded = true;
      }
    }

    function performSearch(image, callback) {
      if(image == undefined) {
        image = null; //getImageFromCamera
      } else {
        if (image.substring(0,4) != "http") {
          image = { base64 : image };
        }
      }
      if(clarifaiLoaded == false) {
        console.log("Clarifai not loaded");
        return;
      }
      clarifai.models.predict(Clarifai.GENERAL_MODEL, image).then(
        function(response) {
          if(response.status.code == 10000) {
            processResponse(response);
          } else {
            console.log(response);
          }
        },
        function(err) {
          console.error(err);
        }
      );

      function processResponse(response) {
        response.outputs.data.concepts.forEach(function(result) {
          predictionResults.push(result.name);
        });
      }
    }

    function getResultsLength() {
      return predictionResults.length;
    }

    function getItemFromResults(index) {
      if(index >= 0 && index < predictionResults.length) {
        return predictionResults[index];
      } else {
        console.log("Index out of bounds");
      }
    }

    function clearResults() {
      predictionResults = [];
    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
      if (clarifaiLoaded == true) {
        return {status: 2, msg: 'Ready'};
      }
      return {status: 1, msg: 'Not connected to API'};
    };

    ext._shutdown = function() {
      predictionResults = [];
      clarifaiLoaded = false;
      clarifai = undefined;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          ['w', 'Connect to API: %s %s', 'initializeClarifai', 'vKCXoGNBI9RrFYs33BUxcDOB3WoMJ5rK9D0hSD4J', 'cva5xoSvMf_htwZZHIZ_9JhjThL8N0BX_PqaJPUj'],
          ['W', 'Search image %s', 'performSearch'],
          ['r', 'Image results count', 'getResultsLength'],
          ['r', 'Get result %n from results', 'getItemFromResults'],
          ['r', 'Clear results', 'clearResults']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Clarifai extension', descriptor, ext);
})({});
