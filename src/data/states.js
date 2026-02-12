// US States data with fuzzy matching support

export const states = [
  // Northeast Region (9 states)
  { name: "Connecticut", code: "CT", capital: "Hartford", region: "Northeast", aliases: ["Conn"] },
  { name: "Maine", code: "ME", capital: "Augusta", region: "Northeast", aliases: [] },
  { name: "Massachusetts", code: "MA", capital: "Boston", region: "Northeast", aliases: ["Mass"] },
  { name: "New Hampshire", code: "NH", capital: "Concord", region: "Northeast", aliases: [] },
  { name: "Rhode Island", code: "RI", capital: "Providence", region: "Northeast", aliases: [] },
  { name: "Vermont", code: "VT", capital: "Montpelier", region: "Northeast", aliases: [] },
  { name: "New Jersey", code: "NJ", capital: "Trenton", region: "Northeast", aliases: [] },
  { name: "New York", code: "NY", capital: "Albany", region: "Northeast", aliases: [] },
  { name: "Pennsylvania", code: "PA", capital: "Harrisburg", region: "Northeast", aliases: ["Penn"] },

  // Southeast Region (14 states)
  { name: "Delaware", code: "DE", capital: "Dover", region: "Southeast", aliases: [] },
  { name: "Florida", code: "FL", capital: "Tallahassee", region: "Southeast", aliases: [] },
  { name: "Georgia", code: "GA", capital: "Atlanta", region: "Southeast", aliases: [] },
  { name: "Maryland", code: "MD", capital: "Annapolis", region: "Southeast", aliases: [] },
  { name: "North Carolina", code: "NC", capital: "Raleigh", region: "Southeast", aliases: [] },
  { name: "South Carolina", code: "SC", capital: "Columbia", region: "Southeast", aliases: [] },
  { name: "Virginia", code: "VA", capital: "Richmond", region: "Southeast", aliases: [] },
  { name: "West Virginia", code: "WV", capital: "Charleston", region: "Southeast", aliases: [] },
  { name: "Alabama", code: "AL", capital: "Montgomery", region: "Southeast", aliases: [] },
  { name: "Kentucky", code: "KY", capital: "Frankfort", region: "Southeast", aliases: [] },
  { name: "Mississippi", code: "MS", capital: "Jackson", region: "Southeast", aliases: [] },
  { name: "Tennessee", code: "TN", capital: "Nashville", region: "Southeast", aliases: ["Tenn"] },
  { name: "Louisiana", code: "LA", capital: "Baton Rouge", region: "Southeast", aliases: [] },
  { name: "Arkansas", code: "AR", capital: "Little Rock", region: "Southeast", aliases: ["Ark"] },

  // Midwest Region (12 states)
  { name: "Illinois", code: "IL", capital: "Springfield", region: "Midwest", aliases: [] },
  { name: "Indiana", code: "IN", capital: "Indianapolis", region: "Midwest", aliases: [] },
  { name: "Michigan", code: "MI", capital: "Lansing", region: "Midwest", aliases: ["Mich"] },
  { name: "Ohio", code: "OH", capital: "Columbus", region: "Midwest", aliases: [] },
  { name: "Wisconsin", code: "WI", capital: "Madison", region: "Midwest", aliases: ["Wisc"] },
  { name: "Iowa", code: "IA", capital: "Des Moines", region: "Midwest", aliases: [] },
  { name: "Kansas", code: "KS", capital: "Topeka", region: "Midwest", aliases: ["Kans"] },
  { name: "Minnesota", code: "MN", capital: "Saint Paul", region: "Midwest", aliases: ["Minn"] },
  { name: "Missouri", code: "MO", capital: "Jefferson City", region: "Midwest", aliases: [] },
  { name: "Nebraska", code: "NE", capital: "Lincoln", region: "Midwest", aliases: ["Nebr"] },
  { name: "North Dakota", code: "ND", capital: "Bismarck", region: "Midwest", aliases: [] },
  { name: "South Dakota", code: "SD", capital: "Pierre", region: "Midwest", aliases: [] },

  // Southwest Region (4 states)
  { name: "Arizona", code: "AZ", capital: "Phoenix", region: "Southwest", aliases: ["Ariz"] },
  { name: "New Mexico", code: "NM", capital: "Santa Fe", region: "Southwest", aliases: [] },
  { name: "Oklahoma", code: "OK", capital: "Oklahoma City", region: "Southwest", aliases: ["Okla"] },
  { name: "Texas", code: "TX", capital: "Austin", region: "Southwest", aliases: ["Tex"] },

  // West Region (13 states)
  { name: "Colorado", code: "CO", capital: "Denver", region: "West", aliases: ["Colo"] },
  { name: "Idaho", code: "ID", capital: "Boise", region: "West", aliases: [] },
  { name: "Montana", code: "MT", capital: "Helena", region: "West", aliases: ["Mont"] },
  { name: "Nevada", code: "NV", capital: "Carson City", region: "West", aliases: ["Nev"] },
  { name: "Utah", code: "UT", capital: "Salt Lake City", region: "West", aliases: [] },
  { name: "Wyoming", code: "WY", capital: "Cheyenne", region: "West", aliases: ["Wyo"] },
  { name: "Alaska", code: "AK", capital: "Juneau", region: "West", aliases: [] },
  { name: "California", code: "CA", capital: "Sacramento", region: "West", aliases: ["Calif"] },
  { name: "Hawaii", code: "HI", capital: "Honolulu", region: "West", aliases: [] },
  { name: "Oregon", code: "OR", capital: "Salem", region: "West", aliases: ["Ore"] },
  { name: "Washington", code: "WA", capital: "Olympia", region: "West", aliases: ["Wash"] },
];

export const regions = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "West",
];

export const regionColors = {
  Northeast: "#3498db",   // Blue
  Southeast: "#e74c3c",   // Red
  Midwest: "#f39c12",     // Orange
  Southwest: "#9b59b6",   // Purple
  West: "#2ecc71",        // Green
};

// Helper function to get states by region
export const getStatesByRegion = (region) => {
  return states.filter((s) => s.region === region);
};

// Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // Deletion
        dp[i][j - 1] + 1,      // Insertion
        dp[i - 1][j - 1] + cost // Substitution
      );
    }
  }
  return dp[m][n];
};

// Calculate similarity between two strings (0-1 scale)
const getSimilarity = (str1, str2) => {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength;
};

// Find a state by name, code, or alias with fuzzy matching
export const findState = (input) => {
  if (!input || typeof input !== "string") return null;

  const normalizedInput = input.toLowerCase().trim();

  // First, try exact matches
  const exactMatch = states.find(
    (s) =>
      s.name.toLowerCase() === normalizedInput ||
      s.code.toLowerCase() === normalizedInput ||
      s.aliases.some((a) => a.toLowerCase() === normalizedInput)
  );

  if (exactMatch) return exactMatch;

  // If no exact match, try fuzzy matching
  const SIMILARITY_THRESHOLD = 0.75;
  const MIN_INPUT_LENGTH = 3;

  if (normalizedInput.length < MIN_INPUT_LENGTH) return null;

  let bestMatch = null;
  let bestSimilarity = 0;

  for (const state of states) {
    // Check similarity with state name
    const nameSimilarity = getSimilarity(normalizedInput, state.name.toLowerCase());
    if (nameSimilarity > bestSimilarity && nameSimilarity >= SIMILARITY_THRESHOLD) {
      bestSimilarity = nameSimilarity;
      bestMatch = state;
    }

    // Check similarity with aliases
    for (const alias of state.aliases) {
      const aliasSimilarity = getSimilarity(normalizedInput, alias.toLowerCase());
      if (aliasSimilarity > bestSimilarity && aliasSimilarity >= SIMILARITY_THRESHOLD) {
        bestSimilarity = aliasSimilarity;
        bestMatch = state;
      }
    }
  }

  return bestMatch;
};

// Get a state by its 2-letter code
export const getStateByCode = (code) => {
  if (!code || typeof code !== "string") return null;
  return states.find((s) => s.code.toLowerCase() === code.toLowerCase()) || null;
};
