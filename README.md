# virtual-tabletop-library
A library to use a virtual tabletop


Usage example in your HTML after including this script
```
document.addEventListener("DOMContentLoaded", function () {
    const mapCanvas = new MapCanvas("game-board", {
        mapUrl: "your_map_image_url_here",
    });
});
```