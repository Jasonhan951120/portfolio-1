/**
 * GMB Service
 * Handles fetching review data from Google My Business API.
 * Includes a robust mock fallback if API keys are missing.
 */

export interface GMBMetrics {
  rating: number;
  reviewCount: number;
  name: string;
}

export const fetchGMBMetrics = async (clinicId?: string): Promise<GMBMetrics> => {
  const apiKey = import.meta.env.VITE_GMB_API_KEY;
  const locationId = import.meta.env.VITE_GMB_LOCATION_ID;

  if (!apiKey || !locationId) {
    // Robust Mock Fallback for Development/Demo
    console.warn("GMB API keys missing. Using mock-fallback reputation data.");
    return {
      rating: 4.8,
      reviewCount: 124,
      name: "Hanlan OC Clinical Hub"
    };
  }

  try {
    // Production API fetching logic (Example structure)
    // Note: Actual GMB API requires OAuth2 or Business Profile API access.
    // This is the structure for the intended production fetch.
    const response = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${clinicId}/locations/${locationId}/reviews`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GMB_ACCESS_TOKEN}`,
      }
    });

    if (!response.ok) throw new Error("GMB API Fetch Failed");

    const data = await response.json();
    return {
      rating: data.averageRating || 4.8,
      reviewCount: data.totalReviewCount || 124,
      name: data.name || "Hanlan OC"
    };
  } catch (error) {
    console.error("GMB Fetch Error:", error);
    return {
      rating: 4.8,
      reviewCount: 124,
      name: "Hanlan OC (Offline)"
    };
  }
};
