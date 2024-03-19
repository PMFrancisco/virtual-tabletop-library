export class MapCanvas {
  constructor(canvasId, { mapUrl, maxWidth = 800, maxHeight = 600 }, onImageLoadedCallback = {}) {
    this.canvasId = canvasId;
    this.mapUrl = mapUrl;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.mapImage = new Image();
    this.imageLoaded = false;
    this.mapX = 0;
    this.mapY = 0;
    this.scaleMap = 1.0;
    this.mode = "interaction";
    this.onImageLoadedCallback = onImageLoadedCallback;
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
      this.adjustMapPosition();
      this.draw();
      if (this.onImageLoadedCallback) {
        this.onImageLoadedCallback();
      }
    };
    this.mapImage.src = this.mapUrl;
  }

  adjustMapPosition() {
    this.mapX = (this.boardWidth - this.mapImage.width * this.scaleMap) / 2;
    this.mapY = (this.boardHeight - this.mapImage.height * this.scaleMap) / 2;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    if (!this.imageLoaded) return;
    this.clearCanvas();

    this.ctx.save();
    this.ctx.translate(this.mapX, this.mapY);
    this.ctx.scale(this.scaleMap, this.scaleMap);
    this.ctx.drawImage(this.mapImage, 0, 0);
    this.ctx.restore();
  }

  setMode(newMode) {
    this.mode = newMode;
  }
}

export class MapInteractionManager {
  constructor(mapCanvas, mapDrawingManager) {
    this.mapCanvas = mapCanvas;
    this.mapDrawingManager = mapDrawingManager;
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.mapCanvas.canvas.addEventListener(
      "mousedown",
      this.mousePressed.bind(this)
    );
    this.mapCanvas.canvas.addEventListener(
      "mousemove",
      this.mouseDragged.bind(this)
    );
    window.addEventListener("mouseup", this.mouseReleased.bind(this));
    this.mapCanvas.canvas.addEventListener("wheel", this.mouseWheel.bind(this));
  }

  mousePressed(event) {
    if (this.mapCanvas.mode !== "interaction") return;
    this.mapCanvas.dragging = true;
    this.mapCanvas.dragStartX = event.offsetX - this.mapCanvas.mapX;
    this.mapCanvas.dragStartY = event.offsetY - this.mapCanvas.mapY;
  }

  mouseDragged(event) {
    if (this.mapCanvas.mode !== "interaction") return;
    if (this.mapCanvas.dragging) {
      this.mapCanvas.mapX = event.offsetX - this.mapCanvas.dragStartX;
      this.mapCanvas.mapY = event.offsetY - this.mapCanvas.dragStartY;
      this.mapCanvas.draw();
      this.mapDrawingManager.redrawAll();
    }
  }

  mouseReleased(event) {
    if (this.mapCanvas.mode !== "interaction") return;
    this.mapCanvas.dragging = false;
  }

  mouseWheel(event) {
    const zoomIntensity = 0.1;
    const wheelDelta = event.deltaY;
    let zoom = Math.exp(wheelDelta * zoomIntensity * -0.01);

    const mouseX =
      (event.offsetX - this.mapCanvas.mapX) / this.mapCanvas.scaleMap;
    const mouseY =
      (event.offsetY - this.mapCanvas.mapY) / this.mapCanvas.scaleMap;

    this.mapCanvas.scaleMap *= zoom;
    this.mapCanvas.scaleMap = Math.max(
      0.5,
      Math.min(3, this.mapCanvas.scaleMap)
    );

    this.mapCanvas.mapX = event.offsetX - mouseX * this.mapCanvas.scaleMap;
    this.mapCanvas.mapY = event.offsetY - mouseY * this.mapCanvas.scaleMap;

    this.mapCanvas.draw();
    this.mapDrawingManager.redrawAll();

    event.preventDefault();
  }
}

export class MapDrawingManager {
  constructor(mapCanvas, options = {}) {
    this.mapCanvas = mapCanvas;
    this.brushColor = options.brushColor || "black";
    this.brushSize = options.brushSize || 5;
    this.drawnElements = [];
    this.attachDrawingEventListeners();
  }

  attachDrawingEventListeners() {
    this.mapCanvas.canvas.addEventListener(
      "mousedown",
      this.startDrawing.bind(this)
    );
    this.mapCanvas.canvas.addEventListener("mousemove", this.draw.bind(this));
    window.addEventListener("mouseup", this.stopDrawing.bind(this));
  }

  startDrawing(event) {
    if (this.mapCanvas.mode !== "drawing") return;

    this.drawing = true;
    const relativeStartX =
      (event.offsetX - this.mapCanvas.mapX) / this.mapCanvas.scaleMap;
    const relativeStartY =
      (event.offsetY - this.mapCanvas.mapY) / this.mapCanvas.scaleMap;
    this.currentPath = {
      color: this.brushColor,
      size: this.brushSize,
      points: [{ x: relativeStartX, y: relativeStartY }],
    };
    this.drawnElements.push(this.currentPath);
  }

  draw(event) {
    if (!this.drawing || this.mapCanvas.mode !== "drawing") return;

    const relativeX =
      (event.offsetX - this.mapCanvas.mapX) / this.mapCanvas.scaleMap;
    const relativeY =
      (event.offsetY - this.mapCanvas.mapY) / this.mapCanvas.scaleMap;
    this.currentPath.points.push({ x: relativeX, y: relativeY });

    this.redrawAll();
  }

  stopDrawing() {
    this.drawing = false;
  }
  updateSettings({ brushColor, brushSize }) {
    if (brushColor !== undefined) {
      this.brushColor = brushColor;
    }
    if (brushSize !== undefined) {
      this.brushSize = brushSize;
    }
  }

  clear() {
    this.drawnElements = [];
    this.mapCanvas.clearCanvas();
    this.mapCanvas.draw();
  }

  redrawAll() {
    this.mapCanvas.clearCanvas();
    this.mapCanvas.draw();

    this.drawnElements.forEach((path) => {
      this.mapCanvas.ctx.beginPath();
      path.points.forEach((point, index) => {
        const canvasX = this.mapCanvas.mapX + point.x * this.mapCanvas.scaleMap;
        const canvasY = this.mapCanvas.mapY + point.y * this.mapCanvas.scaleMap;
        if (index === 0) {
          this.mapCanvas.ctx.moveTo(canvasX, canvasY);
        } else {-
          this.mapCanvas.ctx.lineTo(canvasX, canvasY);
        }
      });
      this.mapCanvas.ctx.strokeStyle = path.color;
      this.mapCanvas.ctx.lineWidth = path.size;
      this.mapCanvas.ctx.stroke();
    });
  }

  initializeDrawnElements(drawnElements) {
    this.drawnElements = drawnElements;
    this.redrawAll();
  }
}
