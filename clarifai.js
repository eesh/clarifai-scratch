(function(ext) {

    var clarifai = undefined;
    var clarifaiLoaded = false;
    var predictionResults = [];


    var videoElement = undefined;
    var hidden_canvas = undefined;

    $.getScript('https://eesh.github.io/scratch-test/clarifai.js', checkClarifai);

    function checkClarifai() {
      if(Clarifai === undefined) {
        console.log("Clarifai not loaded");
        clarifaiLoaded = false;
      } else {
        clarifaiLoaded = true;
      }
    }

    function initializeCamera() {
      console.log("Initializing camera");
      videoElement = document.createElement('video');
      videoElement.id = "camera-stream";
      hidden_canvas = document.createElement('canvas');
      hidden_canvas.id = "imageCanvas";

      navigator.getUserMedia(
          // Options
          {
              video: true
          },
          // Success Callback
          function(stream){
            // Create an object URL for the video stream and
            // set it as src of our HTLM video element.
            videoElement.src = window.URL.createObjectURL(stream);
            // Play the video element to show the stream to the user.
            videoElement.play();
          },
          // Error Callback
          function(err){
              // Most common errors are PermissionDenied and DevicesNotFound.
              console.error(err);
          }
      );
    }

    function takeSnapshot(){
        // Get the exact size of the video element.
        width = videoElement.videoWidth;
        height = videoElement.videoHeight;

        // Context object for working with the canvas.
        context = hidden_canvas.getContext('2d');

        // Set the canvas to the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Draw a copy of the current frame from the video on the canvas.
        context.drawImage(videoElement, 0, 0, width, height);

        // Get an image dataURL from the canvas.
        var imageDataURL = hidden_canvas.toDataURL('image/png');
        return imageDataURL;
    }

    ext.initializeClarifai = function (apikey1, apikey2, callback) {
      clarifai = new Clarifai.App(apikey1, apikey2);
      if (clarifai == undefined) {
        clarifaiLoaded = false;
      } else {
        clarifaiLoaded = true;
        initializeCamera();
      }
      console.log("Clarifai initialized");
      callback();
    }

    ext.performSearch = function(image, callback) {
      if(image == '') {
        if(imageCanvas != undefined) {
          var snapshot = takeSnapshot();
          var base64v = snapshot.substring(snapshot.indexOf(',')+1);
          console.log(base64v);
          image = { base64 : base64v };
        } else callback();
      } else {
        if (image.substring(0,4) != "http") {
          var startIndex = image.indexOf(',')+1;
          base64v = snapshot.substring(startIndex);
          console.log(base64v);
          image = { base64 : base64v };
        }
      }
      if(clarifaiLoaded == false) {
        console.log("Clarifai not loaded");
        callback();
        return;
      }
      console.log(image);
      clarifai.models.predict(Clarifai.GENERAL_MODEL, image).then(
        function(response) {
          console.log(response);
          if(response.status.code == 10000) {
            processResponse(response);
          } else {
            console.log(response);
            callback();
          }
        },
        function(err) {
          console.error(err);
          callback();
        }
      );

      function processResponse(response) {
        console.log("Processing response", response);
        response.outputs[0].data.concepts.forEach(function(result) {
          predictionResults.push(result.name);
        });
        callback();
      }
    }

    ext.getResultsLength = function () {
      return predictionResults.length;
    }

    ext.getItemFromResults = function (index) {
      if(index >= 0 && index < predictionResults.length) {
        return predictionResults[index];
      } else {
        console.log("Index out of bounds");
      }
    }

    ext.clearResults = function () {
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
          ['w', 'Search image %s', 'performSearch', 'https://exoticcars.enterprise.com/etc/designs/exotics/clientlibs/dist/img/homepage/Homepage-Hero-Car.png'],
          ['r', 'Image results count', 'getResultsLength'],
          ['r', 'Get result %n from results', 'getItemFromResults'],
          ['r', 'Clear results', 'clearResults']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Clarifai extension', descriptor, ext);
})({});
