# virtual-tabletop-library
A library to use a virtual tabletop

### Installation

```
npm i virtual-tabletop-library
```

### Usage example in your HTML after including this script

```
document.addEventListener("DOMContentLoaded", function () {
    const mapCanvas = new MapCanvas("game-board", {
        mapUrl: "your_map_image_url_here",
    });
});
```

### Usage example in your React app

```jsx
import React, { useEffect, useRef } from 'react';
import { MapCanvas as MapCanvasLibrary } from './MapCanvas'; // Adjust the import path as necessary

const MapCanvas = ({ canvasId, mapUrl, maxWidth, maxHeight }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const mapCanvas = new MapCanvasLibrary(canvasId, { mapUrl, maxWidth, maxHeight });
      // Additional setup or methods can be called on mapCanvas if needed

      return () => {
        // Perform any cleanup if necessary
      };
    }
  }, [canvasId, mapUrl, maxWidth, maxHeight]);

  return <div id={canvasId} ref={canvasRef}></div>;
};
```

```
const App = () => {
  return (
    <div>
      <MapCanvas
        canvasId="mapCanvas"
        mapUrl="your-map-url.jpg"
        maxWidth={800}
        maxHeight={600}
      />
    </div>
  );
};
```