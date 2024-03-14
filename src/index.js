export class MapCanvas {
  constructor(canvasId, { mapUrl, maxWidth = 800, maxHeight = 600 } = {}) {
    this.canvasId = canvasId;
    this.mapUrl = mapUrl;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.mapImage = new Image();
    this.imageLoaded = false;
    this.mapX = 0;
    this.mapY = 0;
    this.scaleMap = 1.0;
    this.initCanvas();
  }

  initCanvas() {
    const board = document.getElementById(this.canvasId);
    this.boardWidth = Math.min(board.offsetWidth, this.maxWidth);
    this.boardHeight = Math.min(board.offsetHeight, this.maxHeight);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.boardWidth;
    this.canvas.height = this.boardHeight;
    board.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.loadMapImage();
  }

  loadMapImage() {
    this.mapImage.onload = () => {
      this.imageLoaded = true;
      this.mapX = (this.boardWidth - this.mapImage.width * this.scaleMap) / 2;
      this.mapY = (this.boardHeight - this.mapImage.height * this.scaleMap) / 2;
      this.draw();
    };
    this.mapImage.src = this.mapUrl;
  }

  draw() {
    if (!this.imageLoaded) return;
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
    this.ctx.save();
    this.ctx.translate(this.mapX, this.mapY);
    this.ctx.scale(this.scaleMap, this.scaleMap);
    this.ctx.drawImage(this.mapImage, 0, 0);
    this.ctx.restore();
  }
}

export class MapInteractionManager {
  constructor(mapCanvas) {
    this.mapCanvas = mapCanvas;
    this.attachEventListeners();
  }

  attachEventListeners() {
    const canvas = this.mapCanvas.canvas;

    canvas.addEventListener("mousedown", (event) => this.mousePressed(event));
    canvas.addEventListener("mousemove", (event) => this.mouseDragged(event));
    window.addEventListener("mouseup", (event) => this.mouseReleased(event));
    canvas.addEventListener("wheel", (event) => this.mouseWheel(event));
  }

  mousePressed(event) {
    this.mapCanvas.dragging = true;
    this.mapCanvas.dragStartX = event.offsetX - this.mapCanvas.mapX;
    this.mapCanvas.dragStartY = event.offsetY - this.mapCanvas.mapY;
  }

  mouseDragged(event) {
    if (this.mapCanvas.dragging) {
      this.mapCanvas.mapX = event.offsetX - this.mapCanvas.dragStartX;
      this.mapCanvas.mapY = event.offsetY - this.mapCanvas.dragStartY;
      this.mapCanvas.draw();
    }
  }

  mouseReleased(event) {
    this.mapCanvas.dragging = false;
  }

  mouseWheel(event) {
    const zoomIntensity = 0.1;
    const wheelDelta = event.deltaY;
    let zoom = Math.exp(wheelDelta * zoomIntensity * -0.01);

    const mouseX = (event.offsetX - this.mapCanvas.mapX) / this.mapCanvas.scaleMap;
    const mouseY = (event.offsetY - this.mapCanvas.mapY) / this.mapCanvas.scaleMap;

    this.mapCanvas.scaleMap *= zoom;
    this.mapCanvas.scaleMap = Math.max(0.5, Math.min(3, this.mapCanvas.scaleMap));

    this.mapCanvas.mapX = event.offsetX - mouseX * this.mapCanvas.scaleMap;
    this.mapCanvas.mapY = event.offsetY - mouseY * this.mapCanvas.scaleMap;

    this.mapCanvas.draw();
    event.preventDefault();
  }
}
