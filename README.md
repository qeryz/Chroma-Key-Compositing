# Chroma Key Compositing
 Interactive web page in which a user can upload any green screen image/video and a background image, which then produces an output replacing the green screen object with the desired background.
By combining the capabilities of the [`video`](/en-US/docs/Web/HTML/Element/video) element with a [`canvas`](/en-US/docs/Web/HTML/Element/canvas), it allows us to manipulate video data in real time.

## The document content
The two main lines to note from the HTML document:
 <!DOCTYPE html>
     <p> <canvas id = "c1" width="1920" height = "1080"></canvas> </p> 
     <p> <canvas id = "c2" width="1920" height = "1080"></canvas> </p>
 </html>
