var image1 = null;
var image2 = null;

var canvas1 = document.getElementById("can1");
var ctx1 = canvas1.getContext("2d");

var canvas2 = document.getElementById("can2");
var ctx2 = canvas2.getContext("2d");

setCanvas();

function setCanvas(){
  canvas1.width = 400;
  canvas1.height = 200;
  ctx1.font = "30px Arial";
  ctx1.textAlign = "center";
ctx1.fillText("Foreground", canvas1.width/2, canvas1.height/2);
  
  canvas2.width = 400;
  canvas2.height = 200;
  ctx2.font = "30px Arial";
  ctx2.textAlign = "center";
ctx2.fillText("Background", canvas2.width/2, canvas2.height/2);
}

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

function uploadF(){
  var fileinput1 = document.getElementById("finput");
  
  image1 = new SimpleImage(fileinput1);
  image1.drawTo(canvas1);
 
}

function uploadB(){
  var fileinput2 = document.getElementById("binput");
  
  image2 = new SimpleImage(fileinput2);
  image2.drawTo(canvas2);
 
}

function greenScreen(){
  if (image1 == null || ! image1.complete()){
    alert("Foreground not loaded");
    return;
  }
  if (image2 == null || ! image2.complete()){
    alert("Background not loaded");
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
  
  //clearCanvas();
  output.drawTo(canvas2);
}

function clearCanvas () {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  var fin = document.getElementById("finput");
  fin.value = '';
  
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  var bin = document.getElementById("binput");
  bin.value = '';
  
  setCanvas();
}