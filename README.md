# Chroma Key Compositing
 Interactive web page in which a user can upload any green screen image/video and a background image, which then produces an output replacing the green screen object with the desired background.
By combining the capabilities of the [`video`](/en-US/docs/Web/HTML/Element/video) element with a [`canvas`](/en-US/docs/Web/HTML/Element/canvas), it allows us to manipulate video data in real time.

## The document content
The main lines to note from the HTML document:
 <!DOCTYPE html>
          <p> <canvas id = "c1" width="1920" height = "1080"></canvas> </p> 
          <p> <canvas id = "c2" width="1920" height = "1080"></canvas> </p>
    </div>

    <script src="./app.js"></script>
 </html>
 Two key points:
 
1.  This document creates two [`canvas`](/en-US/docs/Web/HTML/Element/canvas) elements, with the IDs `c1` and `c2`.  Canvas `c1` is used to display the current frame of the original video/image, while `c2` is used to display the video after performing the chroma-key algorithm; `c2` is to be preloaded with a still image from the user that will be used to replace the green background in the video.
2.  The JavaScript code is imported from a script named `app.js`.

## The JavaScript code

The JavaScript code in `app.js` consists of 7 methods.

### Initializing the chroma-key player

The `doLoad()` method is called when a user-uploaded video initially loads. This method's function is to prepare the variables needed by the chroma-key processing code, and to set up two event listeners so we can detect when the user starts playing the video or when the video loads on upload.

```js
    doLoad: function() {
      this.video = document.querySelector('#video');

      this.c1 = document.querySelector('#c1');
      this.ctx1 = this.c1.getContext("2d");

      this.c2 = document.querySelector('#c2');
      this.ctx2 = this.c2.getContext("2d");

      let self = this;

      this.video.addEventListener('play', function(){
        self.width = self.video.videoWidth;
        self.height = self.video.videoHeight;
        self.timerCallback();
      });

      this.video.addEventListener('loadeddata', function(){
        self.width = self.video.videoWidth;
        self.height = self.video.videoHeight;
        self.timerCallback();
      });
    },      
```

This code grabs references to the elements in the HTML document that are of our interest, namely the `video` element and the two `canvas` elements.  It also fetches references to the graphics contexts for each of the two canvases.  These will be used when we're actually doing the chroma-keying effect.

Then `addEventListener()` is called to begin watching the `video` element so that we obtain notification when the user presses the play button on the video or the other `addEventListener()` is called to begin watching whne the user initiallyl loads the uploaded video.  In response to the user beginning playback, this code fetches the width and height of the video, then calls the `timerCallback()` method to start watching the video and processing the effect.

### The timer callback

The timer callback is called initially when the video starts playing (when the "play" event occurs), then takes responsibility for establishing itself to be called periodically in order to launch the keying effect for each frame.

```js
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function(){
          self.timerCallback();
      }, 0);
    },
```

The first thing the callback does is check to see if the video is even playing; if it's not, the callback returns immediately without doing anything.

Then it calls the `computeFrame()` method, which performs the chroma-keying effect on the current video frame.

The last thing the callback does is call `setTimeout()` to schedule itself to be called again as soon as possible.  In the real world, you would probably schedule this to be done based on knowledge of the video's frame rate.
