"use client";

import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
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
          setDistance(calculateDistance(YOUSSEF_COORDS[1], YOUSSEF_COORDS[0], data.latitude, data.longitude));
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
          projectionConfig={{
            scale: 560,
            center: [31.2357, 26.5],
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

          {/* Character & Location Pin Marker at Cairo */}
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

            {/* Location Pin Icon right at the character */}
            <g transform="translate(0, -40)">
              {/* Pin body */}
              <path
                d="M 0,-20 C -6,-20 -10,-15.5 -10,-10 C -10,-3.5 0,0 0,0 C 0,0 10,-3.5 10,-10 C 10,-15.5 6,-20 0,-20 Z"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              {/* Inner white dot */}
              <circle cx={0} cy={-10.5} r={3} fill="#ffffff" />
            </g>
          </Marker>
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
