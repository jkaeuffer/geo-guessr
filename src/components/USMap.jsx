import { useEffect, useState, useRef } from "react";
import { getStateByCode, regionColors } from "../data/states";

// Use Albers USA projection for better visual representation
const US_MAP_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json";

function USMap({ guessedStates, onStateClick, activeHintState }) {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;

  // FIPS code to state code mapping
  const fipsToStateCode = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
    "08": "CO", "09": "CT", "10": "DE", "12": "FL", "13": "GA",
    "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
    "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD",
    "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO",
    "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ",
    "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
    "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC",
    "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT",
    "51": "VA", "53": "WA", "54": "WV", "55": "WI", "56": "WY"
  };

  const fipsToCode = (fipsId) => {
    const id = String(fipsId).padStart(2, '0');
    return fipsToStateCode[id] || null;
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        const topojson = await import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm");
        const response = await fetch(US_MAP_URL);
        const us = await response.json();
        const statesGeo = topojson.feature(us, us.objects.states);
        setStates(statesGeo.features);
      } catch (error) {
        console.error("Failed to load US map:", error);
        setStates([]);
      }
      setLoading(false);
    };
    loadMap();
  }, []);

  const handleStateClick = (stateCode) => {
    if (!guessedStates.has(stateCode) && getStateByCode(stateCode)) {
      onStateClick(stateCode);
    }
  };

  // Convert GeoJSON geometry to SVG path (already projected)
  const geoToPath = (geometry) => {
    if (!geometry) return "";

    const ringToPath = (ring) => {
      return ring
        .map((coord, i) => {
          const [x, y] = coord;
          return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ") + " Z";
    };

    if (geometry.type === "Polygon") {
      return geometry.coordinates.map(ringToPath).join(" ");
    } else if (geometry.type === "MultiPolygon") {
      return geometry.coordinates
        .map((polygon) => polygon.map(ringToPath).join(" "))
        .join(" ");
    }
    return "";
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev / 1.5, MIN_ZOOM);
      if (newZoom === MIN_ZOOM) {
        setPan({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev * 1.2, MAX_ZOOM));
    } else {
      setZoom((prev) => {
        const newZoom = Math.max(prev / 1.2, MIN_ZOOM);
        if (newZoom === MIN_ZOOM) {
          setPan({ x: 0, y: 0 });
        }
        return newZoom;
      });
    }
  };

  // Pan controls
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && zoom > 1) {
      const maxPan = ((zoom - 1) / zoom) * 480;
      const newX = Math.max(-maxPan, Math.min(maxPan, e.clientX - startPan.x));
      const newY = Math.max(-maxPan / 2, Math.min(maxPan / 2, e.clientY - startPan.y));
      setPan({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Calculate viewBox for Albers USA projection
  // Albers projection dimensions are approximately 960 x 600
  const baseWidth = 960;
  const baseHeight = 600;
  const viewBoxWidth = baseWidth / zoom;
  const viewBoxHeight = baseHeight / zoom;
  const viewBoxX = (baseWidth - viewBoxWidth) / 2 - (pan.x * 0.5);
  const viewBoxY = (baseHeight - viewBoxHeight) / 2 - (pan.y * 0.5);

  if (loading) {
    return (
      <div className="world-map-container">
        <div className="map-loading">Loading US map...</div>
      </div>
    );
  }

  return (
    <div className="world-map-container">
      <div className="map-controls">
        <button className="map-btn" onClick={handleZoomIn} title="Zoom in">
          +
        </button>
        <button className="map-btn" onClick={handleZoomOut} title="Zoom out">
          −
        </button>
        <button className="map-btn" onClick={handleReset} title="Reset view">
          ⟲
        </button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        className="world-map"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default",
        }}
      >
        {states.map((feature, index) => {
          const fipsCode = feature.id;
          const stateCode = fipsToCode(fipsCode);
          const stateData = stateCode ? getStateByCode(stateCode) : null;
          const isGuessed = stateCode && guessedStates.has(stateCode);
          const isActiveHint = stateCode && activeHintState === stateCode;
          const isValidState = !!stateData;
          const pathD = geoToPath(feature.geometry);

          let fillColor = undefined;
          if (isGuessed && stateData) {
            fillColor = regionColors[stateData.region];
          }

          return (
            <path
              key={`${stateCode || fipsCode}-${index}`}
              d={pathD}
              className={`country ${isGuessed ? "guessed" : ""} ${
                isActiveHint && !isGuessed ? "hint-used" : ""
              }`}
              onClick={() => isValidState && handleStateClick(stateCode)}
              data-code={stateCode}
              style={{
                cursor: isValidState && !isGuessed ? "pointer" : "default",
                fill: fillColor,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default USMap;
