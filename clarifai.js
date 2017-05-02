(function(ext) {

    var clarifai = undefined;
    var clarifaiLoaded = false;

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

    }

    function performSearch(image) {
      if(image == undefined) {
        image = null; //getImageFromCamera
      }
      if(clarifaiLoaded == false) {
        console.log("Clarifai not loaded");
        return;
      }
      clarifai.models.predict(Clarifai.GENERAL_MODEL, image).then(
        function(response) {
          console.log(response);
        },
        function(err) {
          console.error(err);
        }
      );
    }

    function getResultsLength() {

    }

    function getItemFromResults(index) {

    }

    function clearResults() {

    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
          ['w', 'Connect to API: %s %s', 'initializeClarifai', 'vKCXoGNBI9RrFYs33BUxcDOB3WoMJ5rK9D0hSD4J', 'cva5xoSvMf_htwZZHIZ_9JhjThL8N0BX_PqaJPUj'],
          ['w', 'Search image', 'performSearch'],
          ['r', 'Image results count', 'getResultsLength'],
          ['r', 'Get result %n from results', 'getItemFromResults'],
          ['r', 'Clear results', 'clearResults']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Sample extension', descriptor, ext);
})({});
