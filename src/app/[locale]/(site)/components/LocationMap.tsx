"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("about.bento.map");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [visitorCoords, setVisitorCoords] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState(false);

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
          setDistance(calculateDistance(YOUSSEF_COORDS[1], YOUSSEF_COORDS[0], coords[1], coords[0]));
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  // Compute map center and scale statically based on points, with zero movement/dragging
  const { center, scale } = useMemo(() => {
    if (!visitorCoords) {
      return {
        center: [31.2357, 26.5] as [number, number],
        scale: 520,
      };
    }

    const lonDiff = Math.abs(YOUSSEF_COORDS[0] - visitorCoords[0]);
    const latDiff = Math.abs(YOUSSEF_COORDS[1] - visitorCoords[1]);
    const maxDiff = Math.max(lonDiff, latDiff);

    let calculatedScale = 480;
    if (maxDiff > 90) calculatedScale = 140;
    else if (maxDiff > 60) calculatedScale = 190;
    else if (maxDiff > 35) calculatedScale = 270;
    else if (maxDiff > 15) calculatedScale = 380;
    else calculatedScale = 480;

    const calculatedCenter: [number, number] = [
      (YOUSSEF_COORDS[0] + visitorCoords[0]) / 2,
      (YOUSSEF_COORDS[1] + visitorCoords[1]) / 2,
    ];

    return {
      center: calculatedCenter,
      scale: calculatedScale,
    };
  }, [visitorCoords]);

  if (!mounted) return null;

  return (
    <div className="w-full bg-white dark:bg-[#1a1b26] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="relative w-full h-[280px] sm:h-[350px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale,
            center,
          }}
          width={800}
          height={400}
          className="w-full h-full object-cover outline-none select-none pointer-events-none"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="fill-[#e5e7eb] dark:fill-[#343b54] stroke-white dark:stroke-[#1a1b26] outline-none"
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

          {/* Dashed line connecting Youssef and the Visitor */}
          {visitorCoords && distance !== null && distance >= 30 && (
            <Line
              from={YOUSSEF_COORDS}
              to={visitorCoords}
              stroke="var(--color-primary, #f97316)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="4, 4"
            />
          )}

          {/* Youssef Marker (Sitting Character at Cairo) */}
          <Marker coordinates={YOUSSEF_COORDS}>
            {/* Subtle natural ground shadow */}
            <ellipse cx={0} cy={1.5} rx={14} ry={4} fill="#000000" opacity={0.25} />

            {/* Sitting Character */}
            <image
              href="/images/sit%20character.png"
              x={-19}
              y={-36}
              width={38}
              height={38}
              className="pointer-events-none select-none drop-shadow-md"
            />
          </Marker>

          {/* Second Person / Visitor Marker (Location Pin Icon) */}
          {visitorCoords && (
            <Marker coordinates={visitorCoords}>
              <g transform="translate(0, 0)">
                {/* Subtle shadow under pin tip */}
                <ellipse cx={0} cy={1} rx={4.5} ry={1.8} fill="#000000" opacity={0.3} />
                {/* Pin body */}
                <path
                  d="M 0,-24 C -7,-24 -12,-19 -12,-12 C -12,-4 0,0 0,0 C 0,0 12,-4 12,-12 C 12,-19 7,-24 0,-24 Z"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  className="drop-shadow-md"
                />
                {/* Inner white dot */}
                <circle cx={0} cy={-12} r={3.5} fill="#ffffff" />
              </g>
            </Marker>
          )}
        </ComposableMap>
      </div>

      <div className="bg-gray-50 dark:bg-[#15161e] p-6 sm:p-8 text-center border-t border-gray-200 dark:border-gray-800">
        {distance === null && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-base animate-pulse">{t("locating")}</p>
        )}
        {error && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("fallback")}
          </p>
        )}
        {distance !== null && (
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            {t("distance", { distance: distance.toLocaleString(locale === "ar" ? "ar-EG" : "en-US") })}
          </p>
        )}
      </div>
    </div>
  );
}
