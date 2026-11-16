// lib/distance.ts
import { SITE } from "./constants";

/**
 * Haversine distance between two lat/lng points, in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Geocode a UK address string into { lat, lng } using OpenStreetMap Nominatim.
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "GinzaTakeaway/1.0 (contact@ginza.co.uk)",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
  }
}

/**
 * Check if an address is within our delivery radius.
 */
export async function checkDeliveryEligibility(
  fullAddress: string
): Promise<{
  eligible: boolean;
  distanceKm: number | null;
  reason?: string;
}> {
  const coords = await geocodeAddress(fullAddress);

  if (!coords) {
    return {
      eligible: false,
      distanceKm: null,
      reason: "Could not locate that address. Please check and try again.",
    };
  }

  const distanceKm = haversineDistance(
    SITE.location.lat,
    SITE.location.lng,
    coords.lat,
    coords.lng
  );

  const eligible = distanceKm <= SITE.deliveryRadiusKm;

  return {
    eligible,
    distanceKm: Math.round(distanceKm * 100) / 100,
    reason: eligible
      ? undefined
      : `Sorry, we only deliver within ${SITE.deliveryRadiusKm} km. You're ${distanceKm.toFixed(
          1
        )} km away — pickup is available.`,
  };
}