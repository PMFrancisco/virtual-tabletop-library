export class MapCanvas {
  constructor(boardId, imageUrl) {
    this.board = document.getElementById(boardId);
    this.imageUrl = imageUrl;
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d");
    this.mapImage = new Image();
    this.imageLoaded = false;
    this.mapX = 0;
    this.mapY = 0;
    this.scaleMap = 1.0;
    this.loadImage();
  }

  createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.width = this.board.offsetWidth;
    canvas.height = this.board.offsetHeight;
    this.board.appendChild(canvas);
    return canvas;
  }

  loadImage() {
    this.mapImage.onload = () => {
      this.imageLoaded = true;
      this.mapX = (this.canvas.width - this.mapImage.width) / 2;
      this.mapY = (this.canvas.height - this.mapImage.height) / 2;
      this.draw(); 
    };
    this.mapImage.src = this.imageUrl;
  }

  moveMap(dx, dy) {
    this.mapX += dx;
    this.mapY += dy;
    this.draw(); 
  }

  zoomMap(zoomDirection) {
    const zoomIntensity = 0.1;
    this.scaleMap += zoomDirection * zoomIntensity;
    this.draw(); 
  }

  draw() {
    if (this.imageLoaded) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
      this.ctx.translate(this.mapX, this.mapY);
      this.ctx.scale(this.scaleMap, this.scaleMap);
      this.ctx.drawImage(this.mapImage, 0, 0); 
      this.ctx.restore(); 
    }
  }
}

