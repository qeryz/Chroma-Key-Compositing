// Author: Marcos Padilla
// Latest Revision: 09/16/2021
// References and Guides for the video chroma key compositing:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
// References and Guides for the image chroma key compositing:
// http://www.dukelearntoprogram.com/course1/common/js/cs101/SimpleImage.js

// The following variables are used to help differentiate between video or image compositing
var image1 = null;
var image2 = null;
var canvas2 = document.getElementById("c2");
var boolVideo = true; 

// Safety check to prevent compositing error
function checkDimensions(){
  if (image2.getWidth() < image1.getWidth()){
    alert("Please select a background image that is bigger in width and height than the foreground image.");
    return false;
  }
  else{
    alert("Success!");
    return true;
  }
}

// Function solely responsible for image composites, using Duke University's Simple Image script
function greenScreen(){
    if (image1 == null || ! image1.complete()){
    alert("Foreground image not loaded");
    return;
    }
    if (image2 == null || ! image2.complete()){
    alert("Background image not loaded");
    return;
    }

    if (!checkDimensions()){
    return;
    }

    var output = new SimpleImage(image1.getWidth(), image1.getHeight());

    for (var pixel of image1.values()){
        var greenThreshold = pixel.getBlue() + pixel.getRed();
        var x = pixel.getX();
        var y = pixel.getY();
        if (pixel.getGreen() > greenThreshold){
            var bgPixel = image2.getPixel(x,y);
            output.setPixel(x,y, bgPixel);
        }
        else{
            output.setPixel(x, y, pixel);
        }
    }
  
  output.drawTo(canvas2);
}

// Function for foreground input responsible for drawing either an image or video onto the canvas(es)
function uploadF(self){
    var file = self.files[0];
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];

    // If the file is an image, do
    if (validImageTypes.includes(fileType)){
        var canvas1 = document.getElementById("c1");
        var fileinput1 = document.getElementById("finput");

        image1 = new SimpleImage(fileinput1);
        image1.drawTo(canvas1);
        boolVideo = false;
        if (document.getElementById("binput") != null){
            uploadB(document.getElementById("binput"));
        }
    }

    // Else if the file is a video, do
    else {
        var reader = new FileReader();

        reader.onload = function(e) {
            var src = e.target.result;
            var video = document.getElementById("video");
            var source = document.getElementById("source");

            source.setAttribute("src", src);
            video.load();
            video.play();
        };

        reader.readAsDataURL(file);
        boolVideo = true;

        processor.doLoad();
    }
 
}

// Function for the background input only takes images, however if the foreground is
// a video file, draw the background file as canvas 2's background image.
// Else, if foreground is an image, simply draw the background to canvas 2.
function uploadB(self){

    if (!boolVideo){
        var canvas2 = document.getElementById("c2");
        var fileinput2 = document.getElementById("binput");
        
        image2 = new SimpleImage(fileinput2);
        image2.drawTo(canvas2);
    }

    else{
        var file = document.getElementById("binput").files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
            document.getElementById('c2').style.backgroundImage = "url(" + reader.result + ")";        
        }
        if(file){
            reader.readAsDataURL(file);
        }
        else{
        }
    }
 
}

// Set of function under processor, solely responsible for video composites
let processor = {
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
    computeFrame: function() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
      let l = frame.data.length / 4;
  
      for (let i = 0; i < l; i++){
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        if (g > r + b) {
          frame.data[i * 4 + 3] = 0;
        }
      }
      this.ctx2.putImageData(frame, 0, 0);
    }
  
  };

  // Function that clears and resets the canvases
  function clearCanvas () {
    var c1 = document.getElementById("c1");
    var ctx1 = c1.getContext("2d");
    ctx1.clearRect(0, 0, c1.width, c1.height);
    var fin = document.getElementById("finput");
    fin.value = '';
    
    var c2 = document.getElementById("c2");
    var ctx2 = c2.getContext("2d");   
    ctx2.clearRect(0, 0, c2.width, c2.height);
    c2.style.backgroundImage = "url('')";
    var bin = document.getElementById("binput");
    bin.value = '';
    
    var videoElement = document.getElementById('video');
    videoElement.pause();
    

    image1 = null;
    image2 = null;
    boolVideo = true;

    c1.width = 1920;
    c1.height = 1080;
    c2.width = 1920;
    c2.height = 1080;

}
