export class MapInteractionManager {
    constructor(canvasManager) {
      this.canvasManager = canvasManager;
      this.initEventListeners();
    }
  
    initEventListeners() {
      const canvas = this.canvasManager.canvas;
  
      canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
      canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
      canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
      canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
      canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
    }
  
    handleMouseDown(event) {
      this.dragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  
    handleMouseMove(event) {
      if (!this.dragging) return;
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.canvasManager.moveMap(dx, dy); 
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  
    handleMouseUp(event) {
      this.dragging = false;
    }
  
    handleMouseWheel(event) {
      event.preventDefault();
      const zoomDirection = event.deltaY < 0 ? 1 : -1;
      this.canvasManager.zoomMap(zoomDirection); 
    }
  }