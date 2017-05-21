---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: default
---

<h1>Examples</h1>

* <h3><a href="http://scratchx.org/?url=https://eesh.github.io/clarifai-scratch/examples/clarifai_link.sbx#scratch">Search using link</a></h3>

* <h3><a href="http://scratchx.org/?url=https://eesh.github.io/clarifai-scratch/examples/clarifai_data.sbx#scratch">Search using dataURI</a></h3>

* <h3><a href="http://scratchx.org/?url=https://eesh.github.io/clarifai-scratch/examples/clarifai_camera_search.sbx#scratch">Search using camera</a></h3>


<h1>Setup</h1>

![Clarifai setup]({{site.url}}{{site.baseurl}}/assets/images/clarifai-setup.gif)

* Go to [Clarifai's website](https://clarifai.com/) and get a free API key.

* Go to [ScratchX](scratchx.org/#scratch) and hit the **Load experimental extension** button.

* Use the following URL to load the extension via URL.

* Put the API keys in the  **Connect to API block** and execute the block to initialize the Clarifai API.



<h1>Usage</h1>

* <h3>To search using image URL</h3>

  ![Search with URL]({{site.url}}{{site.baseurl}}/assets/images/clarifai-ex-1.gif)

  * Place the **Search image using link** block in the Scratch script.

  * Paste the image URL in the input area of the block.

* <h3>To search using camera</h3>

  * Place the **Search image using camera** block in the Scratch script.

  * Click allow when camera permissions are prompted.

  * Note: Camera can only be accessed when on secure https domains. If you want to test the feature camera feature on ScratchX, you can start Chrome in insecure mode
    which will allow you to access the camera on Scratch.

    * If you are on macOS, use the following command in **terminal** to open Chrome in insecure mode:
      ```bash
      open -a "Google Chrome" --args --unsafely-treat-insecure-origin-as-secure="http://scratchx.org/" --user-data-dir
      ```
      ![Terminal]({{site.url}}{{site.baseurl}}/assets/images/terminal.png)

    * Untested: If you are on windows, use the following command in command prompt:
    ```bash
    chrome.exe --unsafely-treat-insecure-origin-as-secure="http://scratchx.org/" --user-data-dir
    ```

* <h3>To search using base64 image data</h3>

  * Place the **Search image using DataURI** block in the Scratch script.

  * Paste the base64 image data in the input area of the block.

* <h3>Using results</h3>

  ![Results example]({{site.url}}{{site.baseurl}}/assets/images/results-example.png)

  * <h4>To get the count of results</h4>

    * Use the **Image results count** reporter block

  * <h4>To get each result from results</h4>

    * Use the **Get result x from results** reporter block and put a value for x where x is an index from *0* to *count of results - 1*.
