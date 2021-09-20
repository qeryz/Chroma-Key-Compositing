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
 Two key notes:
 
1.  This document creates two [`canvas`](/en-US/docs/Web/HTML/Element/canvas) elements, with the IDs `c1` and `c2`.  Canvas `c1` is used to display the current frame of the original video/image, while `c2` is used to display the video after performing the chroma-key algorithm; `c2` is to be preloaded with a still image from the user that will be used to replace the green background in the video.
2.  The JavaScript code is imported from a script named `app.js`.

## The JavaScript code

The JavaScript code in `processor.js` consists of three methods.

### Initializing the chroma-key player
