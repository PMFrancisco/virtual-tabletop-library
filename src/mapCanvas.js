class MapCanvas {
    constructor(canvasId, options) {
        this.canvasId = canvasId;
        this.options = options;
        this.mapImage = new Image();
        this.imageLoaded = false;
        this.mapX = 0;
        this.mapY = 0;
        this.dragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.scaleMap = 1.0;
        this.initCanvas();
    }

    initCanvas() {
        const board = document.getElementById(this.canvasId);
        this.boardWidth = board.offsetWidth;
        this.boardHeight = board.offsetHeight;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.boardWidth;
        this.canvas.height = this.boardHeight;
        board.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.loadMapImage(this.options.mapUrl);
        this.attachEventListeners();
    }

    loadMapImage(url) {
        this.mapImage.src = url;
        this.mapImage.onload = () => {
            this.imageLoaded = true;
            this.mapX = (this.boardWidth - this.mapImage.width * this.scaleMap) / 2;
            this.mapY = (this.boardHeight - this.mapImage.height * this.scaleMap) / 2;
            this.draw();
        };
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

    attachEventListeners() {
        this.canvas.addEventListener('mousedown', (event) => this.mousePressed(event));
        this.canvas.addEventListener('mousemove', (event) => this.mouseDragged(event));
        window.addEventListener('mouseup', (event) => this.mouseReleased(event));
        this.canvas.addEventListener('wheel', (event) => this.mouseWheel(event));
    }

    mousePressed(event) {
        this.dragging = true;
        this.dragStartX = event.offsetX - this.mapX;
        this.dragStartY = event.offsetY - this.mapY;
    }

    mouseDragged(event) {
        if (this.dragging) {
            this.mapX = event.offsetX - this.dragStartX;
            this.mapY = event.offsetY - this.dragStartY;
            this.draw();
        }
    }

    mouseReleased(event) {
        this.dragging = false;
    }

    mouseWheel(event) {
        const zoomIntensity = 0.1;
        const wheelDelta = event.deltaY;
        let zoom = Math.exp(wheelDelta * zoomIntensity * -0.01);
        
        const mouseX = (event.offsetX - this.mapX) / this.scaleMap;
        const mouseY = (event.offsetY - this.mapY) / this.scaleMap;
    
        this.scaleMap *= zoom;
        this.scaleMap = Math.max(0.5, Math.min(3, this.scaleMap)); 
    
        this.mapX = event.offsetX - mouseX * this.scaleMap;
        this.mapY = event.offsetY - mouseY * this.scaleMap;
    
        this.draw();
        event.preventDefault();
    }
}

