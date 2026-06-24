"use client";

import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup
} from "react-simple-maps";
import { useTheme } from "next-themes";
import { animate } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Cairo, Egypt coordinates [longitude, latitude]
const YOUSSEF_COORDS: [number, number] = [31.2357, 30.0444];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function LocationMap() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visitorCoords, setVisitorCoords] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [visitorLocation, setVisitorLocation] = useState<string>("");
  const [error, setError] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 30]); // Default center near Egypt
  const [mapZoom, setMapZoom] = useState(1); // Start zoomed out

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          const coords: [number, number] = [data.longitude, data.latitude];
          setVisitorCoords(coords);
          setVisitorLocation(`${data.city}, ${data.country_name}`);
          setDistance(calculateDistance(YOUSSEF_COORDS[1], YOUSSEF_COORDS[0], coords[1], coords[0]));

          // Calculate center
          setMapCenter([
            (YOUSSEF_COORDS[0] + coords[0]) / 2,
            (YOUSSEF_COORDS[1] + coords[1]) / 2,
          ]);

          // Calculate zoom based on coordinate distance
          const lonDiff = Math.abs(YOUSSEF_COORDS[0] - coords[0]);
          const latDiff = Math.abs(YOUSSEF_COORDS[1] - coords[1]);
          const maxDiff = Math.max(lonDiff, latDiff);
          
          let targetZoom = 1;
          if (maxDiff < 15) targetZoom = 3.5;
          else if (maxDiff < 30) targetZoom = 2.8;
          else if (maxDiff < 60) targetZoom = 2.0;
          else if (maxDiff < 100) targetZoom = 1.4;
          else targetZoom = 1.1;

          // Smoothly animate the zoom level
          animate(1, targetZoom, {
            duration: 2,
            ease: "easeInOut",
            onUpdate: (latest) => setMapZoom(latest)
          });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-white dark:bg-[#1a1b26] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="relative w-full h-[280px] sm:h-[350px]">
        <ComposableMap
          projection="geoMercator"
          width={800}
          height={400}
          className="w-full h-full object-cover outline-none"
        >
          <ZoomableGroup center={mapCenter} zoom={mapZoom} minZoom={1} maxZoom={8}>
            <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="fill-[#e5e7eb] dark:fill-[#343b54] stroke-white dark:stroke-[#1a1b26] outline-none transition-colors duration-300 hover:fill-[#d1d5db] dark:hover:fill-[#454e6b]"
                  strokeWidth={0.75}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Line between locations */}
          {visitorCoords && distance !== null && distance >= 50 && (
            <Line
              from={YOUSSEF_COORDS}
              to={visitorCoords}
              stroke="var(--color-primary, #f97316)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="4, 4"
            />
          )}

          {/* Markers */}
          {distance !== null && distance < 50 ? (
            <Marker coordinates={YOUSSEF_COORDS}>
              <circle r={6} fill="var(--color-primary, #f97316)" />
              <circle r={20} fill="var(--color-primary, #f97316)" opacity={0.3} />
              <circle r={12} fill="#10b981" opacity={0.5} />
              <text
                textAnchor="middle"
                y={-25}
                className="fill-[#1f2937] dark:fill-white font-bold text-[10px]"
                style={{ fontFamily: "system-ui" }}
              >
                You & Youssef
              </text>
            </Marker>
          ) : (
            <>
              {/* Youssef Marker */}
              <Marker coordinates={YOUSSEF_COORDS}>
                <circle r={6} fill="var(--color-primary, #f97316)" />
                <circle r={14} fill="var(--color-primary, #f97316)" opacity={0.3} />
                <text
                  textAnchor="middle"
                  y={-20}
                  className="fill-[#1f2937] dark:fill-white font-bold text-[8px]"
                  style={{ fontFamily: "system-ui" }}
                >
                  Our Forge
                </text>
              </Marker>

              {/* Visitor Marker */}
              {visitorCoords && (
                <Marker coordinates={visitorCoords}>
                  <circle r={6} fill="#10b981" />
                  <circle r={14} fill="#10b981" opacity={0.3} />
                  <text
                    textAnchor="middle"
                    y={25}
                    className="fill-[#1f2937] dark:fill-white font-bold text-[8px]"
                    style={{ fontFamily: "system-ui" }}
                  >
                    You
                  </text>
                </Marker>
              )}
            </>
          )}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="bg-gray-50 dark:bg-[#15161e] p-6 sm:p-8 text-center border-t border-gray-200 dark:border-gray-800">
        {!visitorCoords && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-base animate-pulse">Locating your position...</p>
        )}
        {error && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            I'm from Cairo, Egypt. Nice to meet you!
          </p>
        )}
        {visitorCoords && distance !== null && (
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            I'm from <span className="text-gray-900 dark:text-white italic text-sm font-bold">Cairo, Egypt</span>, roughly{" "}
            <span className="text-primary text-sm font-bold">{distance.toLocaleString()} km</span> away from
            your current location according to your IP address.
          </p>
        )}
      </div>
    </div>
  );
}
