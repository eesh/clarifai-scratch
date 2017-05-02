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
      console.log("Getting UserMedia");
      navigator.getUserMedia(
          // Options
          {
              video: true
          },
          // Success Callback
          function(stream){
            console.log("starting stream");
            // Create an object URL for the video stream and
            // set it as src of our HTLM video element.
            videoElement.src = window.URL.createObjectURL(stream);

            console.log("Playing stream");
            // Play the video element to show the stream to the user.
            videoElement.play();
            console.log("Initialized camera");

          },
          // Error Callback
          function(err){

              // Most common errors are PermissionDenied and DevicesNotFound.
              console.error(err);

          }
      );
    }

    function takeSnapshot(){

        var hidden_canvas = document.querySelector('#imageCanvas'),
        video = document.querySelector('#camera_stream');

        // Get the exact size of the video element.
        width = video.videoWidth,
        height = video.videoHeight,

        // Context object for working with the canvas.
        context = hidden_canvas.getContext('2d');


        // Set the canvas to the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Draw a copy of the current frame from the video on the canvas.
        context.drawImage(video, 0, 0, width, height);

        // Get an image dataURL from the canvas.
        var imageDataURL = hidden_canvas.toDataURL('image/png');
        return imageDataURL;
    }

    ext.initializeClarifai = function (apikey1, apikey2) {
      var clarifai = new Clarifai.App(apikey1, apikey2);
      if (clarifai == undefined) {
        clarifaiLoaded = false;
      } else {
        clarifaiLoaded = true;
        initializeCamera();
      }
      console.log("Clarifai initialized")
    }

    function performSearch(image, callback) {
      if(image == undefined) {
        if(imageCanvas != undefined) {
          image = takeSnapshot();
        } else callback();
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
