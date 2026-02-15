import { useEffect, useState } from "react";
import { getStateByCode } from "../data/states";

const US_MAP_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json";

// FIPS code to state code mapping (same as USMap)
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

const stateCodeToFips = Object.fromEntries(
  Object.entries(fipsToStateCode).map(([fips, code]) => [code, fips])
);

// Convert GeoJSON geometry to SVG path (already projected Albers coords)
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

// Compute bounding box of a GeoJSON geometry
const getBoundingBox = (geometry) => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const processCoords = (coords) => {
    for (const [x, y] of coords) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  };

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach(processCoords);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon) => polygon.forEach(processCoords));
  }

  return { minX, minY, maxX, maxY };
};

function StateShapeViewer({ stateCode, currentIndex, totalStates }) {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const topojson = await import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm");
        const response = await fetch(US_MAP_URL);
        const us = await response.json();
        const statesGeo = topojson.feature(us, us.objects.states);
        setFeatures(statesGeo.features);
      } catch (error) {
        console.error("Failed to load US map data:", error);
        setFeatures([]);
      }
      setLoading(false);
    };
    loadMap();
  }, []);

  if (loading) {
    return (
      <div className="world-map-container">
        <div className="map-loading">Loading state shape...</div>
      </div>
    );
  }

  // Find the feature for the requested state
  const fipsCode = stateCodeToFips[stateCode];
  const feature = features.find((f) => String(f.id).padStart(2, "0") === fipsCode);

  if (!feature) {
    return (
      <div className="world-map-container">
        <div className="map-loading">State not found</div>
      </div>
    );
  }

  const pathD = geoToPath(feature.geometry);
  const bbox = getBoundingBox(feature.geometry);

  // Add padding (10% on each side)
  const width = bbox.maxX - bbox.minX;
  const height = bbox.maxY - bbox.minY;
  const paddingX = width * 0.1;
  const paddingY = height * 0.1;
  const viewBoxX = bbox.minX - paddingX;
  const viewBoxY = bbox.minY - paddingY;
  const viewBoxW = width + paddingX * 2;
  const viewBoxH = height + paddingY * 2;

  const stateData = getStateByCode(stateCode);

  return (
    <div className="world-map-container">
      <div className="shape-progress">
        State {currentIndex} / {totalStates}
      </div>
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`}
        className="world-map state-shape-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={pathD}
          className="country state-shape"
          data-code={stateCode}
        />
      </svg>
    </div>
  );
}

export default StateShapeViewer;
