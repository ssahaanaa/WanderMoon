
const packages = [
  {
    id: 1,
    destination: "Goa",
    title: "Goa Beach Getaway",
    type: "Beach",
    pricePerPerson: 8500,
    rating: 4.5,
    days: 4,
    description: "Relax on sandy beaches, enjoy water sports and vibrant nightlife.",
    itinerary: [
      "Day 1: Arrival, check-in, evening at Baga Beach",
      "Day 2: Water sports and North Goa sightseeing",
      "Day 3: South Goa churches and beaches",
      "Day 4: Leisure time and departure"
    ],
    inclusions: ["Hotel stay", "Daily breakfast", "Airport transfers"],
    exclusions: ["Flights", "Lunch and dinner", "Personal expenses"]
  },
  {
    id: 2,
    destination: "Manali",
    title: "Manali Mountain Escape",
    type: "Mountain",
    pricePerPerson: 12000,
    rating: 4.7,
    days: 5,
    description: "Snow-capped peaks, adventure sports and cozy mountain cafes.",
    itinerary: [
      "Day 1: Arrival and local market visit",
      "Day 2: Solang Valley adventure activities",
      "Day 3: Rohtang Pass excursion",
      "Day 4: Old Manali and cafes",
      "Day 5: Departure"
    ],
    inclusions: ["Hotel stay", "Daily breakfast and dinner", "Sightseeing cab"],
    exclusions: ["Flights", "Adventure activity charges", "Personal expenses"]
  },
  {
    id: 3,
    destination: "Jaipur",
    title: "Jaipur Heritage Tour",
    type: "Heritage",
    pricePerPerson: 7000,
    rating: 4.3,
    days: 3,
    description: "Explore forts, palaces and the rich culture of the Pink City.",
    itinerary: [
      "Day 1: Amber Fort and City Palace",
      "Day 2: Hawa Mahal and local bazaars",
      "Day 3: Nahargarh Fort and departure"
    ],
    inclusions: ["Hotel stay", "Daily breakfast", "Guided tours"],
    exclusions: ["Flights", "Lunch and dinner", "Monument entry fees"]
  },
  {
    id: 4,
    destination: "Kerala",
    title: "Kerala Backwaters",
    type: "Nature",
    pricePerPerson: 15000,
    rating: 4.8,
    days: 6,
    description: "Cruise through calm backwaters on a traditional houseboat.",
    itinerary: [
      "Day 1: Arrival in Kochi",
      "Day 2: Munnar tea gardens",
      "Day 3: Thekkady wildlife sanctuary",
      "Day 4: Alleppey houseboat cruise",
      "Day 5: Backwater villages",
      "Day 6: Departure"
    ],
    inclusions: ["Hotel and houseboat stay", "All meals on houseboat", "Cab transfers"],
    exclusions: ["Flights", "Meals outside houseboat", "Personal expenses"]
  },
  {
    id: 5,
    destination: "Ladakh",
    title: "Ladakh Adventure",
    type: "Mountain",
    pricePerPerson: 18000,
    rating: 4.9,
    days: 7,
    description: "High-altitude lakes, monasteries and thrilling road trips.",
    itinerary: [
      "Day 1: Arrival and acclimatization",
      "Day 2: Leh local sightseeing",
      "Day 3: Nubra Valley via Khardung La",
      "Day 4: Pangong Lake",
      "Day 5: Monastery tour",
      "Day 6: Leisure day",
      "Day 7: Departure"
    ],
    inclusions: ["Hotel/camp stay", "All meals", "Permits and cab"],
    exclusions: ["Flights", "Oxygen cylinder (if needed)", "Personal expenses"]
  },
  {
    id: 6,
    destination: "Andaman",
    title: "Andaman Island Escape",
    type: "Beach",
    pricePerPerson: 20000,
    rating: 4.6,
    days: 5,
    description: "Crystal clear waters, scuba diving and untouched islands.",
    itinerary: [
      "Day 1: Arrival in Port Blair",
      "Day 2: Havelock Island and Radhanagar Beach",
      "Day 3: Scuba diving and water sports",
      "Day 4: Neil Island exploration",
      "Day 5: Departure"
    ],
    inclusions: ["Hotel stay", "Daily breakfast", "Ferry transfers"],
    exclusions: ["Flights", "Scuba diving charges", "Lunch and dinner"]
  }
];

export default packages;
