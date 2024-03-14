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
  