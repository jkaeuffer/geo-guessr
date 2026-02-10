import { useEffect, useState, useRef } from "react";
import { getCountryByCode, continentColors } from "../data/countries";

const WORLD_MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function WorldMap({ guessedCountries, onCountryClick, activeHintCountry }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;

  useEffect(() => {
    const loadMap = async () => {
      try {
        const topojson = await import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm");
        const response = await fetch(WORLD_MAP_URL);
        const world = await response.json();
        const countriesGeo = topojson.feature(world, world.objects.countries);
        setCountries(countriesGeo.features);
      } catch (error) {
        console.error("Failed to load map:", error);
        setCountries([]);
      }
      setLoading(false);
    };
    loadMap();
  }, []);

const handleCountryClick = (countryCode) => {
    if (!guessedCountries.has(countryCode) && getCountryByCode(countryCode)) {
      onCountryClick(countryCode);
    }
  };

const numericToAlpha2 = {
    "4": "AF", "8": "AL", "12": "DZ", "20": "AD", "24": "AO", "28": "AG", "32": "AR",
    "36": "AU", "40": "AT", "31": "AZ", "44": "BS", "48": "BH", "50": "BD", "52": "BB",
    "112": "BY", "56": "BE", "84": "BZ", "204": "BJ", "64": "BT", "68": "BO", "70": "BA",
    "72": "BW", "76": "BR", "96": "BN", "100": "BG", "854": "BF", "108": "BI", "116": "KH",
    "120": "CM", "124": "CA", "132": "CV", "140": "CF", "148": "TD", "152": "CL", "156": "CN",
    "170": "CO", "174": "KM", "178": "CG", "180": "CD", "188": "CR", "384": "CI", "191": "HR",
    "192": "CU", "196": "CY", "203": "CZ", "208": "DK", "262": "DJ", "212": "DM", "214": "DO",
    "218": "EC", "818": "EG", "222": "SV", "226": "GQ", "232": "ER", "233": "EE", "231": "ET",
    "242": "FJ", "246": "FI", "250": "FR", "266": "GA", "270": "GM", "268": "GE", "276": "DE",
    "288": "GH", "300": "GR", "308": "GD", "320": "GT", "324": "GN", "624": "GW", "328": "GY",
    "332": "HT", "340": "HN", "348": "HU", "352": "IS", "356": "IN", "360": "ID", "364": "IR",
    "368": "IQ", "372": "IE", "376": "IL", "380": "IT", "388": "JM", "392": "JP", "400": "JO",
    "398": "KZ", "404": "KE", "296": "KI", "408": "KP", "410": "KR", "414": "KW", "417": "KG",
    "418": "LA", "428": "LV", "422": "LB", "426": "LS", "430": "LR", "434": "LY", "438": "LI",
    "440": "LT", "442": "LU", "807": "MK", "450": "MG", "454": "MW", "458": "MY", "462": "MV",
    "466": "ML", "470": "MT", "584": "MH", "478": "MR", "480": "MU", "484": "MX", "583": "FM",
    "498": "MD", "492": "MC", "496": "MN", "499": "ME", "504": "MA", "508": "MZ", "104": "MM",
    "516": "NA", "520": "NR", "524": "NP", "528": "NL", "554": "NZ", "558": "NI", "562": "NE",
    "566": "NG", "578": "NO", "512": "OM", "586": "PK", "585": "PW", "275": "PS", "591": "PA",
    "598": "PG", "600": "PY", "604": "PE", "608": "PH", "616": "PL", "620": "PT", "634": "QA",
    "642": "RO", "643": "RU", "646": "RW", "659": "KN", "662": "LC", "670": "VC", "882": "WS",
    "674": "SM", "678": "ST", "682": "SA", "686": "SN", "688": "RS", "690": "SC", "694": "SL",
    "702": "SG", "703": "SK", "705": "SI", "90": "SB", "706": "SO", "710": "ZA", "728": "SS",
    "724": "ES", "144": "LK", "736": "SD", "740": "SR", "748": "SZ", "752": "SE", "756": "CH",
    "760": "SY", "158": "TW", "762": "TJ", "834": "TZ", "764": "TH", "626": "TL", "768": "TG",
    "776": "TO", "780": "TT", "788": "TN", "792": "TR", "795": "TM", "798": "TV", "800": "UG",
    "804": "UA", "784": "AE", "826": "GB", "840": "US", "858": "UY", "860": "UZ", "548": "VU",
    "862": "VE", "704": "VN", "887": "YE", "894": "ZM", "716": "ZW", "-99": "XK"
  };

  // Helper function to convert numeric ID to alpha-2 code
  const numericToAlpha2Code = (numericId) => {
    // Try direct lookup first
    const id = String(numericId);
    if (numericToAlpha2[id]) {
      return numericToAlpha2[id];
    }
    // Try without leading zeros (in case ID comes as "076" instead of "76")
    const numericValue = parseInt(id, 10);
    if (!isNaN(numericValue) && numericToAlpha2[String(numericValue)]) {
      return numericToAlpha2[String(numericValue)];
    }
    return null;
  };

  const geoToPath = (geometry) => {
    if (!geometry) return "";

    const project = (coord) => {
      const x = coord[0];
      const y = -coord[1];
      return [x, y];
    };

    const crossesAntimeridian = (ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        const lon1 = ring[i][0];
        const lon2 = ring[i + 1][0];
        if (Math.abs(lon2 - lon1) > 180) {
          return true;
        }
      }
      return false;
    };

    const splitRingAtAntimeridian = (ring) => {
      const segments = [];
      let currentSegment = [];

      for (let i = 0; i < ring.length; i++) {
        const coord = ring[i];
        const prevCoord = i > 0 ? ring[i - 1] : null;

        if (prevCoord && Math.abs(coord[0] - prevCoord[0]) > 180) {
          if (currentSegment.length > 0) {
            const sign = prevCoord[0] > 0 ? 1 : -1;
            const edgeLat = prevCoord[1] + (coord[1] - prevCoord[1]) *
              ((sign * 180 - prevCoord[0]) / (coord[0] + sign * 360 - prevCoord[0]));
            currentSegment.push([sign * 180, edgeLat]);
            segments.push(currentSegment);
            currentSegment = [[-sign * 180, edgeLat]];
          }
        }
        currentSegment.push(coord);
      }

      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      return segments;
    };

    const ringToPath = (ring) => {
      if (crossesAntimeridian(ring)) {
        const segments = splitRingAtAntimeridian(ring);
        return segments.map(segment => {
          return segment.map((coord, i) => {
            const [x, y] = project(coord);
            return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
          }).join(" ") + " Z";
        }).join(" ");
      }

      return ring.map((coord, i) => {
        const [x, y] = project(coord);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(" ") + " Z";
    };

    if (geometry.type === "Polygon") {
      return geometry.coordinates.map(ringToPath).join(" ");
    } else if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.map(polygon =>
        polygon.map(ringToPath).join(" ")
      ).join(" ");
    }
    return "";
  };

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

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && zoom > 1) {
      const maxPan = ((zoom - 1) / zoom) * 180;
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

  const viewBoxWidth = 360 / zoom;
  const viewBoxHeight = 180 / zoom;
  const viewBoxX = -180 + (360 - viewBoxWidth) / 2 - (pan.x / 2);
  const viewBoxY = -90 + (180 - viewBoxHeight) / 2 - (pan.y / 2);

  if (loading) {
    return (
      <div className="world-map-container">
        <div className="map-loading">Loading world map...</div>
      </div>
    );
  }

  return (
    <div className="world-map-container">
      <div className="map-controls">
        <button className="map-btn" onClick={handleZoomIn} title="Zoom in">+</button>
        <button className="map-btn" onClick={handleZoomOut} title="Zoom out">−</button>
        <button className="map-btn" onClick={handleReset} title="Reset view">⟲</button>
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
        style={{ cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default" }}
      >
{countries.map((feature, index) => {
          const numericCode = feature.id;
          const countryCode = numericToAlpha2Code(numericCode);
          const countryData = countryCode ? getCountryByCode(countryCode) : null;
          const isGuessed = countryCode && guessedCountries.has(countryCode);
          const isActiveHint = countryCode && activeHintCountry === countryCode;
          const isValidCountry = !!countryData;
          const pathD = geoToPath(feature.geometry);

          // Get continent color for guessed countries
          const fillColor = isGuessed && countryData
            ? continentColors[countryData.continent]
            : undefined;

          return (
            <path
              key={`${countryCode || numericCode}-${index}`}
              d={pathD}
              className={`country ${isGuessed ? "guessed" : ""} ${isActiveHint && !isGuessed ? "hint-used" : ""}`}
              onClick={() => isValidCountry && handleCountryClick(countryCode)}
              data-code={countryCode}
              style={{
                cursor: isValidCountry && !isGuessed ? "pointer" : "default",
                fill: fillColor,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default WorldMap;
