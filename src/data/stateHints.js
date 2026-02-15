import { getStateByCode } from "./states";

// Hint data for all 50 US states
// - famousPerson: well-known person born in or strongly associated with the state
// - cities: cities ranked ~11-20 by population (not top 10, not capital)
// - topCities: major cities (top 10) that are NOT the capital
// - neighbors: bordering state codes

export const stateHints = {
  AL: {
    famousPerson: "Rosa Parks",
    cities: ["Florence", "Prattville", "Phenix City"],
    topCities: ["Birmingham", "Huntsville", "Mobile"],
    neighbors: ["TN", "GA", "FL", "MS"],
  },
  AK: {
    famousPerson: "Jewel (singer)",
    cities: ["Homer", "Soldotna", "Valdez"],
    topCities: ["Anchorage", "Fairbanks"],
    neighbors: [],
  },
  AZ: {
    famousPerson: "Stevie Nicks",
    cities: ["Avondale", "Goodyear", "Casa Grande"],
    topCities: ["Tucson", "Mesa", "Scottsdale"],
    neighbors: ["CA", "NV", "UT", "CO", "NM"],
  },
  AR: {
    famousPerson: "Johnny Cash",
    cities: ["Hot Springs", "Benton", "Sherwood"],
    topCities: ["Fort Smith", "Springdale"],
    neighbors: ["MO", "TN", "MS", "LA", "TX", "OK"],
  },
  CA: {
    famousPerson: "Marilyn Monroe",
    cities: ["Santa Ana", "Riverside", "Stockton"],
    topCities: ["Los Angeles", "San Francisco", "San Diego"],
    neighbors: ["OR", "NV", "AZ"],
  },
  CO: {
    famousPerson: "Jack Dempsey",
    cities: ["Greeley", "Broomfield", "Castle Rock"],
    topCities: ["Colorado Springs", "Aurora"],
    neighbors: ["WY", "NE", "KS", "OK", "NM", "UT"],
  },
  CT: {
    famousPerson: "Katharine Hepburn",
    cities: ["West Haven", "Milford", "Middletown"],
    topCities: ["Bridgeport", "New Haven", "Waterbury"],
    neighbors: ["NY", "MA", "RI"],
  },
  DE: {
    famousPerson: "Joe Biden",
    cities: ["Milford", "Seaford", "Georgetown"],
    topCities: ["Wilmington"],
    neighbors: ["MD", "PA", "NJ"],
  },
  FL: {
    famousPerson: "Jim Morrison",
    cities: ["Pembroke Pines", "Hollywood", "Coral Springs"],
    topCities: ["Miami", "Tampa", "Orlando", "Jacksonville"],
    neighbors: ["GA", "AL"],
  },
  GA: {
    famousPerson: "Martin Luther King Jr.",
    cities: ["Alpharetta", "Marietta", "Valdosta"],
    topCities: ["Augusta", "Columbus"],
    neighbors: ["TN", "NC", "SC", "FL", "AL"],
  },
  HI: {
    famousPerson: "Barack Obama",
    cities: ["Kihei", "Kapolei", "Mililani"],
    topCities: [],
    neighbors: [],
  },
  ID: {
    famousPerson: "Ezra Pound",
    cities: ["Rexburg", "Eagle", "Moscow"],
    topCities: ["Nampa", "Meridian"],
    neighbors: ["MT", "WY", "UT", "NV", "OR", "WA"],
  },
  IL: {
    famousPerson: "Walt Disney",
    cities: ["Cicero", "Bloomington", "Evanston"],
    topCities: ["Chicago", "Aurora", "Rockford"],
    neighbors: ["WI", "IN", "KY", "MO", "IA"],
  },
  IN: {
    famousPerson: "Michael Jackson",
    cities: ["Muncie", "Terre Haute", "Noblesville"],
    topCities: ["Fort Wayne", "Evansville", "South Bend"],
    neighbors: ["MI", "OH", "KY", "IL"],
  },
  IA: {
    famousPerson: "John Wayne",
    cities: ["Dubuque", "Urbandale", "Cedar Falls"],
    topCities: ["Cedar Rapids", "Davenport"],
    neighbors: ["MN", "WI", "IL", "MO", "NE", "SD"],
  },
  KS: {
    famousPerson: "Amelia Earhart",
    cities: ["Hutchinson", "Leavenworth", "Garden City"],
    topCities: ["Wichita", "Overland Park", "Kansas City"],
    neighbors: ["NE", "MO", "OK", "CO"],
  },
  KY: {
    famousPerson: "Muhammad Ali",
    cities: ["Nicholasville", "Elizabethtown", "Henderson"],
    topCities: ["Louisville", "Lexington"],
    neighbors: ["OH", "WV", "VA", "TN", "MO", "IL", "IN"],
  },
  LA: {
    famousPerson: "Louis Armstrong",
    cities: ["New Iberia", "Slidell", "Ruston"],
    topCities: ["New Orleans", "Shreveport"],
    neighbors: ["AR", "MS", "TX"],
  },
  ME: {
    famousPerson: "Stephen King",
    cities: ["Westbrook", "Saco", "Gorham"],
    topCities: ["Portland"],
    neighbors: ["NH"],
  },
  MD: {
    famousPerson: "Babe Ruth",
    cities: ["Cumberland", "Westminster", "Greenbelt"],
    topCities: ["Baltimore"],
    neighbors: ["PA", "DE", "VA", "WV"],
  },
  MA: {
    famousPerson: "John F. Kennedy",
    cities: ["Newton", "Somerville", "Framingham"],
    topCities: ["Worcester", "Springfield", "Cambridge"],
    neighbors: ["NH", "VT", "NY", "CT", "RI"],
  },
  MI: {
    famousPerson: "Henry Ford",
    cities: ["Kalamazoo", "Westland", "Southfield"],
    topCities: ["Detroit", "Grand Rapids", "Ann Arbor"],
    neighbors: ["OH", "IN", "WI"],
  },
  MN: {
    famousPerson: "Prince",
    cities: ["Eagan", "Eden Prairie", "Lakeville"],
    topCities: ["Minneapolis"],
    neighbors: ["WI", "IA", "SD", "ND"],
  },
  MS: {
    famousPerson: "Elvis Presley",
    cities: ["Oxford", "Starkville", "Clinton"],
    topCities: ["Gulfport", "Southaven"],
    neighbors: ["TN", "AL", "LA", "AR"],
  },
  MO: {
    famousPerson: "Mark Twain",
    cities: ["Florissant", "Joplin", "Blue Springs"],
    topCities: ["Kansas City", "St. Louis", "Springfield"],
    neighbors: ["IA", "IL", "KY", "TN", "AR", "OK", "KS", "NE"],
  },
  MT: {
    famousPerson: "Evel Knievel",
    cities: ["Belgrade", "Whitefish", "Lewistown"],
    topCities: ["Billings"],
    neighbors: ["ND", "SD", "WY", "ID"],
  },
  NE: {
    famousPerson: "Warren Buffett",
    cities: ["Papillion", "La Vista", "Scottsbluff"],
    topCities: ["Omaha"],
    neighbors: ["SD", "IA", "MO", "KS", "CO", "WY"],
  },
  NV: {
    famousPerson: "Andre Agassi",
    cities: ["Fernley", "Fallon", "Winnemucca"],
    topCities: ["Las Vegas", "Henderson"],
    neighbors: ["OR", "ID", "UT", "AZ", "CA"],
  },
  NH: {
    famousPerson: "Adam Sandler",
    cities: ["Laconia", "Hampton", "Salem"],
    topCities: ["Manchester", "Nashua"],
    neighbors: ["ME", "VT", "MA"],
  },
  NJ: {
    famousPerson: "Bruce Springsteen",
    cities: ["Clifton", "Camden", "Passaic"],
    topCities: ["Newark", "Jersey City", "Paterson"],
    neighbors: ["NY", "PA", "DE"],
  },
  NM: {
    famousPerson: "Neil Patrick Harris",
    cities: ["Carlsbad", "Gallup", "Los Lunas"],
    topCities: ["Albuquerque"],
    neighbors: ["CO", "OK", "TX", "AZ", "UT"],
  },
  NY: {
    famousPerson: "Theodore Roosevelt",
    cities: ["White Plains", "Troy", "Niagara Falls"],
    topCities: ["New York City", "Buffalo", "Rochester"],
    neighbors: ["VT", "MA", "CT", "NJ", "PA"],
  },
  NC: {
    famousPerson: "Michael Jordan",
    cities: ["Asheville", "Gastonia", "Jacksonville"],
    topCities: ["Charlotte", "Durham", "Greensboro"],
    neighbors: ["VA", "TN", "GA", "SC"],
  },
  ND: {
    famousPerson: "Peggy Lee",
    cities: ["Devils Lake", "Valley City", "Grafton"],
    topCities: ["Fargo"],
    neighbors: ["MN", "SD", "MT"],
  },
  OH: {
    famousPerson: "Neil Armstrong",
    cities: ["Hamilton", "Springfield", "Kettering"],
    topCities: ["Cleveland", "Cincinnati", "Toledo"],
    neighbors: ["MI", "PA", "WV", "KY", "IN"],
  },
  OK: {
    famousPerson: "Brad Pitt",
    cities: ["Muskogee", "Bartlesville", "Owasso"],
    topCities: ["Tulsa"],
    neighbors: ["KS", "MO", "AR", "TX", "NM", "CO"],
  },
  OR: {
    famousPerson: "Matt Groening",
    cities: ["Albany", "Tigard", "Grants Pass"],
    topCities: ["Portland", "Eugene"],
    neighbors: ["WA", "ID", "NV", "CA"],
  },
  PA: {
    famousPerson: "Benjamin Franklin",
    cities: ["York", "State College", "Wilkes-Barre"],
    topCities: ["Philadelphia", "Pittsburgh"],
    neighbors: ["NY", "NJ", "DE", "MD", "WV", "OH"],
  },
  RI: {
    famousPerson: "H.P. Lovecraft",
    cities: ["West Warwick", "Johnston", "Bristol"],
    topCities: ["Warwick", "Cranston"],
    neighbors: ["CT", "MA"],
  },
  SC: {
    famousPerson: "James Brown",
    cities: ["Spartanburg", "Sumter", "Myrtle Beach"],
    topCities: ["Charleston", "North Charleston"],
    neighbors: ["NC", "GA"],
  },
  SD: {
    famousPerson: "Sitting Bull",
    cities: ["Spearfish", "Brandon", "Madison"],
    topCities: ["Sioux Falls"],
    neighbors: ["ND", "MN", "IA", "NE", "WY", "MT"],
  },
  TN: {
    famousPerson: "Dolly Parton",
    cities: ["Hendersonville", "Kingsport", "Collierville"],
    topCities: ["Memphis", "Knoxville"],
    neighbors: ["KY", "VA", "NC", "GA", "AL", "MS", "AR", "MO"],
  },
  TX: {
    famousPerson: "Beyoncé",
    cities: ["Lubbock", "Irving", "Amarillo"],
    topCities: ["Houston", "Dallas", "San Antonio"],
    neighbors: ["OK", "AR", "LA", "NM"],
  },
  UT: {
    famousPerson: "Philo Farnsworth",
    cities: ["Lehi", "Logan", "Taylorsville"],
    topCities: ["West Valley City", "Provo"],
    neighbors: ["ID", "WY", "CO", "NM", "AZ", "NV"],
  },
  VT: {
    famousPerson: "Bernie Sanders",
    cities: ["St. Johnsbury", "Middlebury", "Shelburne"],
    topCities: [],
    neighbors: ["NH", "MA", "NY"],
  },
  VA: {
    famousPerson: "George Washington",
    cities: ["Lynchburg", "Harrisonburg", "Charlottesville"],
    topCities: ["Virginia Beach", "Norfolk", "Arlington"],
    neighbors: ["MD", "WV", "KY", "TN", "NC"],
  },
  WA: {
    famousPerson: "Jimi Hendrix",
    cities: ["Spokane Valley", "Kirkland", "Bellingham"],
    topCities: ["Seattle"],
    neighbors: ["OR", "ID"],
  },
  WV: {
    famousPerson: "Chuck Yeager",
    cities: ["South Charleston", "Bluefield", "Vienna"],
    topCities: ["Huntington"],
    neighbors: ["PA", "MD", "VA", "KY", "OH"],
  },
  WI: {
    famousPerson: "Harry Houdini",
    cities: ["La Crosse", "Sheboygan", "Fond du Lac"],
    topCities: ["Milwaukee", "Kenosha"],
    neighbors: ["MI", "MN", "IA", "IL"],
  },
  WY: {
    famousPerson: "Jackson Pollock",
    cities: ["Cody", "Lander", "Torrington"],
    topCities: [],
    neighbors: ["MT", "SD", "NE", "CO", "UT", "ID"],
  },
};

/**
 * Get hint text for a given state and hint level.
 * Levels: 1=famous person, 2=mid-size city (rank ~11-20), 3=top city, 4=capital, 5=one neighbor, 6=all neighbors
 * Returns { label, value } or null if level > 6.
 */
export const getHintForState = (stateCode, level) => {
  if (!stateCode || level < 1 || level > 6) return null;

  const hints = stateHints[stateCode];
  if (!hints) return null;

  const stateData = getStateByCode(stateCode);

  switch (level) {
    case 1:
      return { label: "Famous person", value: hints.famousPerson };
    case 2: {
      const city = hints.cities.length > 0 ? hints.cities[0] : null;
      return city
        ? { label: "A mid-size city in this state", value: city }
        : { label: "A mid-size city in this state", value: stateData?.capital || "N/A" };
    }
    case 3: {
      const topCity = hints.topCities.length > 0 ? hints.topCities[0] : null;
      return topCity
        ? { label: "A major city", value: topCity }
        : { label: "Note", value: "The capital is also the largest city" };
    }
    case 4:
      return { label: "Capital", value: stateData?.capital || "Unknown" };
    case 5: {
      if (hints.neighbors.length === 0) {
        return { label: "Neighbors", value: "This state has no bordering states" };
      }
      const neighbor = getStateByCode(hints.neighbors[0]);
      return { label: "A neighboring state", value: neighbor?.name || hints.neighbors[0] };
    }
    case 6: {
      if (hints.neighbors.length === 0) {
        return { label: "Neighbors", value: "This state has no bordering states" };
      }
      const names = hints.neighbors.map(code => {
        const s = getStateByCode(code);
        return s?.name || code;
      });
      return { label: "All neighbors", value: names.join(", ") };
    }
    default:
      return null;
  }
};
