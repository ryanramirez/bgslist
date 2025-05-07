export interface City {
  id: string;
  name: string;
  state: string;
  displayName: string;
}

export const cities: City[] = [
  { id: "nyc", name: "New York", state: "NY", displayName: "New York, NY" },
  { id: "la", name: "Los Angeles", state: "CA", displayName: "Los Angeles, CA" },
  { id: "chicago", name: "Chicago", state: "IL", displayName: "Chicago, IL" },
  { id: "houston", name: "Houston", state: "TX", displayName: "Houston, TX" },
  { id: "phoenix", name: "Phoenix", state: "AZ", displayName: "Phoenix, AZ" },
  { id: "philly", name: "Philadelphia", state: "PA", displayName: "Philadelphia, PA" },
  { id: "san-antonio", name: "San Antonio", state: "TX", displayName: "San Antonio, TX" },
  { id: "san-diego", name: "San Diego", state: "CA", displayName: "San Diego, CA" },
  { id: "dallas", name: "Dallas", state: "TX", displayName: "Dallas, TX" },
  { id: "sf", name: "San Francisco", state: "CA", displayName: "San Francisco, CA" },
  { id: "austin", name: "Austin", state: "TX", displayName: "Austin, TX" },
  { id: "seattle", name: "Seattle", state: "WA", displayName: "Seattle, WA" },
  { id: "denver", name: "Denver", state: "CO", displayName: "Denver, CO" },
  { id: "boston", name: "Boston", state: "MA", displayName: "Boston, MA" },
  { id: "portland", name: "Portland", state: "OR", displayName: "Portland, OR" },
  { id: "vegas", name: "Las Vegas", state: "NV", displayName: "Las Vegas, NV" },
  { id: "detroit", name: "Detroit", state: "MI", displayName: "Detroit, MI" },
  { id: "atlanta", name: "Atlanta", state: "GA", displayName: "Atlanta, GA" },
  { id: "miami", name: "Miami", state: "FL", displayName: "Miami, FL" },
  { id: "minneapolis", name: "Minneapolis", state: "MN", displayName: "Minneapolis, MN" },
  { id: "sacramento", name: "Sacramento", state: "CA", displayName: "Sacramento, CA" },
  { id: "cleveland", name: "Cleveland", state: "OH", displayName: "Cleveland, OH" },
  { id: "new-orleans", name: "New Orleans", state: "LA", displayName: "New Orleans, LA" },
  { id: "tampa", name: "Tampa", state: "FL", displayName: "Tampa, FL" },
  { id: "pittsburgh", name: "Pittsburgh", state: "PA", displayName: "Pittsburgh, PA" },
  { id: "charlotte", name: "Charlotte", state: "NC", displayName: "Charlotte, NC" },
  { id: "nashville", name: "Nashville", state: "TN", displayName: "Nashville, TN" },
  { id: "raleigh", name: "Raleigh", state: "NC", displayName: "Raleigh, NC" },
  { id: "salt-lake", name: "Salt Lake City", state: "UT", displayName: "Salt Lake City, UT" },
  { id: "stlouis", name: "St. Louis", state: "MO", displayName: "St. Louis, MO" },
  { id: "kc", name: "Kansas City", state: "MO", displayName: "Kansas City, MO" },
  { id: "okc", name: "Oklahoma City", state: "OK", displayName: "Oklahoma City, OK" },
  { id: "tucson", name: "Tucson", state: "AZ", displayName: "Tucson, AZ" },
  { id: "albuquerque", name: "Albuquerque", state: "NM", displayName: "Albuquerque, NM" },
  { id: "omaha", name: "Omaha", state: "NE", displayName: "Omaha, NE" },
  { id: "anchorage", name: "Anchorage", state: "AK", displayName: "Anchorage, AK" },
  { id: "honolulu", name: "Honolulu", state: "HI", displayName: "Honolulu, HI" },
  { id: "ithaca", name: "Ithaca", state: "NY", displayName: "Ithaca, NY" },
  { id: "madison", name: "Madison", state: "WI", displayName: "Madison, WI" },
  { id: "burlington", name: "Burlington", state: "VT", displayName: "Burlington, VT" }
];

export const getCityByDisplayName = (displayName: string): City | undefined => {
  return cities.find(city => city.displayName === displayName);
};

export const getCityById = (id: string): City | undefined => {
  return cities.find(city => city.id === id);
}; 