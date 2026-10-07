import { ImageSourcePropType } from "react-native";

export interface ServiceCategory {
  id: string;
  number: string;
  title: string;
  tag: string;
  description: string;
  longDescription: string;
  image: ImageSourcePropType;
  badge: string;
  priceEstimate: string;
  basePrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  popularTasks: string[];
}

export const WORKIVO_SERVICES: ServiceCategory[] = [
  {
    id: "electrician",
    number: "01",
    title: "Electrician",
    tag: "Electrician",
    description: "Switches, wiring and fittings sorted safely, right in your home.",
    longDescription:
      "Expert electrical repairs, installations, and safety inspections by certified electricians with specialized insulated tools and genuine spare parts.",
    image: require("../../assets/images/electrician.jpg"),
    badge: "Verified Electrician",
    priceEstimate: "From ₹249",
    basePrice: 249,
    duration: "45–90 mins",
    rating: 4.9,
    reviewsCount: 1420,
    popularTasks: [
      "Switchboard & socket replacement",
      "MCB & fuse repair",
      "Fan & chandelier fitting",
      "Complete house wiring safety check",
    ],
  },
  {
    id: "cook",
    number: "02",
    title: "Home cooking",
    tag: "Home cooking",
    description: "A cook in your own kitchen, from everyday meals to guests at home.",
    longDescription:
      "Nutritious, authentic home-cooked meals prepared in your kitchen with your ingredients. Options for North/South Indian, diet plans, and family feasts.",
    image: require("../../assets/images/cook.jpg"),
    badge: "Professional Cook",
    priceEstimate: "From ₹399/meal",
    basePrice: 399,
    duration: "1–2 hours",
    rating: 4.9,
    reviewsCount: 2180,
    popularTasks: [
      "Everyday lunch & dinner cooking",
      "North & South Indian cuisines",
      "Party & guest catering (up to 15 guests)",
      "Healthy diet & high-protein meal prep",
    ],
  },
  {
    id: "barber",
    number: "03",
    title: "Barber at home",
    tag: "Barber at home",
    description: "A fresh haircut without leaving the sofa or losing your evening.",
    longDescription:
      "Salon-grade haircut, beard grooming, and relaxation services right in your living room with sterilized tools, single-use capes, and clean cleanup.",
    image: require("../../assets/images/barber.jpg"),
    badge: "Master Stylist",
    priceEstimate: "From ₹299",
    basePrice: 299,
    duration: "30–45 mins",
    rating: 4.8,
    reviewsCount: 1840,
    popularTasks: [
      "Men's custom haircut & styling",
      "Beard shaping & straight razor line-up",
      "Head massage & cooling hair spa",
      "Father & son grooming combo",
    ],
  },
  {
    id: "beauty",
    number: "04",
    title: "Nails and beauty",
    tag: "Nails and beauty",
    description: "Manicure and pedicure in comfort, on your schedule.",
    longDescription:
      "Pampering skincare, facials, waxing, and nail therapies delivered by certified beauticians using sealed premium product kits.",
    image: require("../../assets/images/beauty.jpg"),
    badge: "Certified Beautician",
    priceEstimate: "From ₹499",
    basePrice: 499,
    duration: "60–90 mins",
    rating: 4.9,
    reviewsCount: 3120,
    popularTasks: [
      "Spa manicure & pedicure with scrub",
      "Instant glow herbal facial",
      "Honey wax & eyebrow threading",
      "Gel polish & nail art overlay",
    ],
  },
  {
    id: "carpenter",
    number: "05",
    title: "Furniture repair",
    tag: "Furniture repair",
    description: "Wobbly chairs and broken frames fixed by skilled hands.",
    longDescription:
      "Precision woodworking, hardware replacements, and custom furniture assembly by seasoned carpenters equipped with power tools.",
    image: require("../../assets/images/carpenter.jpg"),
    badge: "Expert Carpenter",
    priceEstimate: "From ₹349",
    basePrice: 349,
    duration: "1–2 hours",
    rating: 4.8,
    reviewsCount: 960,
    popularTasks: [
      "Door latch, lock & hinge repair",
      "Bed frame assembly & creak fix",
      "Wardrobe sliding track repair",
      "Wall floating shelf mounting",
    ],
  },
  {
    id: "plumber",
    number: "06",
    title: "Plumbing",
    tag: "Plumbing",
    description: "Leaks, taps and drains handled with clean, careful work.",
    longDescription:
      "Fast response for dripping faucets, low water pressure, clogged drains, and bathroom sanitary fitting replacements.",
    image: require("../../assets/images/plumber.jpg"),
    badge: "Certified Plumber",
    priceEstimate: "From ₹249",
    basePrice: 249,
    duration: "30–60 mins",
    rating: 4.9,
    reviewsCount: 2450,
    popularTasks: [
      "Tap & mixer faucet leak repair",
      "Toilet flush tank repair",
      "Kitchen sink pipe clog clearance",
      "Water geyser connection & pipe fitting",
    ],
  },
  {
    id: "cleaning",
    number: "07",
    title: "Home cleaning",
    tag: "Home cleaning",
    description: "Kitchens, dishes and every corner left fresh and tidy.",
    longDescription:
      "High-power deep cleaning, degreasing, and sanitization using eco-friendly solutions and industrial vacuums.",
    image: require("../../assets/images/cleaning.jpg"),
    badge: "Deep Clean Crew",
    priceEstimate: "From ₹799",
    basePrice: 799,
    duration: "2–4 hours",
    rating: 4.9,
    reviewsCount: 4200,
    popularTasks: [
      "Complete home deep cleaning",
      "Kitchen chimney & oil degreasing",
      "Bathroom stain removal & sanitization",
      "Sofa & upholstery wet shampooing",
    ],
  },
  {
    id: "ac-service",
    number: "08",
    title: "AC service",
    tag: "AC service",
    description: "Home or office, your cooling checked and running well again.",
    longDescription:
      "Power-jet coil cleaning, gas leak detection, filter sterilization, and cooling efficiency optimization for all split and window AC brands.",
    image: require("../../assets/images/ac-service.jpg"),
    badge: "HVAC Specialist",
    priceEstimate: "From ₹449",
    basePrice: 449,
    duration: "45–60 mins",
    rating: 4.8,
    reviewsCount: 1980,
    popularTasks: [
      "Foam-jet indoor & outdoor coil wash",
      "Gas leak check & R32/R410A top-up",
      "Water leakage & drain line fix",
      "AC uninstallation & reinstallation",
    ],
  },
  {
    id: "movers",
    number: "09",
    title: "Packers and movers",
    tag: "Packers and movers",
    description: "Careful packing and a team that treats your things like their own.",
    longDescription:
      "Stress-free shifting with multi-layer bubble wrap, carton boxing, skilled handling of heavy appliances, and safe transport.",
    image: require("../../assets/images/movers.jpg"),
    badge: "Relocation Team",
    priceEstimate: "Custom Quote",
    basePrice: 1499,
    duration: "Half / Full day",
    rating: 4.9,
    reviewsCount: 870,
    popularTasks: [
      "1 BHK / 2 BHK local house shifting",
      "Fragile glassware & TV packing",
      "Heavy furniture dismantling & setup",
      "Dedicated mini-truck transit",
    ],
  },
  {
    id: "laundry",
    number: "10",
    title: "Laundry",
    tag: "Laundry",
    description: "Sorted, washed and folded, so your weekend is yours again.",
    longDescription:
      "Doorstep pickup and return of neatly washed, dried, steam-ironed, and folded clothes. Premium fabric care detergents only.",
    image: require("../../assets/images/laundry.jpg"),
    badge: "Wash & Iron Care",
    priceEstimate: "From ₹199",
    basePrice: 199,
    duration: "Same day / 24 hrs",
    rating: 4.8,
    reviewsCount: 1650,
    popularTasks: [
      "Wash & steam iron bundle (per kg)",
      "Gentle dry cleaning for sarees & suits",
      "Curtains & bed linen deep wash",
      "Express 12-hour turnaround service",
    ],
  },
];
