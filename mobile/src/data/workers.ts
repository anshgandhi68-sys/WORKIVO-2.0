import { ImageSourcePropType } from "react-native";

export interface WorkerProfile {
  id: string;
  name: string;
  trade: string;
  serviceId: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  experienceYears: number;
  image: ImageSourcePropType;
  hourlyRate: string;
  verified: boolean;
  city: string;
  bio: string;
  specialties: string[];
}

export const WORKIVO_WORKERS: WorkerProfile[] = [
  {
    id: "pro-1",
    name: "Rajesh Kumar",
    trade: "Certified Electrician",
    serviceId: "electrician",
    rating: 4.9,
    reviewsCount: 312,
    completedJobs: 840,
    experienceYears: 7,
    image: require("../../assets/images/electrician.jpg"),
    hourlyRate: "₹249/hr",
    verified: true,
    city: "Bengaluru",
    bio: "ITI-certified master electrician with 7+ years of experience in residential wiring, short-circuit troubleshooting, and smart switch automation.",
    specialties: ["MCB Repairs", "Heavy Inverter Wiring", "Chandelier Fitting"],
  },
  {
    id: "pro-2",
    name: "Sunita Deshmukh",
    trade: "Executive Home Cook",
    serviceId: "cook",
    rating: 4.9,
    reviewsCount: 520,
    completedJobs: 1420,
    experienceYears: 10,
    image: require("../../assets/images/cook.jpg"),
    hourlyRate: "₹399/meal",
    verified: true,
    city: "Bengaluru",
    bio: "Passionate home chef specializing in hygienic Maharashtrian, Gujarati, and North Indian home meals with minimal oil and authentic masalas.",
    specialties: ["Wholesome Thali", "Healthy Meal Prep", "Event Catering"],
  },
  {
    id: "pro-3",
    name: "Arjun Sharma",
    trade: "Master Barber",
    serviceId: "barber",
    rating: 4.8,
    reviewsCount: 290,
    completedJobs: 780,
    experienceYears: 6,
    image: require("../../assets/images/barber.jpg"),
    hourlyRate: "₹299/session",
    verified: true,
    city: "Bengaluru",
    bio: "Trained stylist bringing precision fades, luxury hot towel shaves, and relaxing beard spas directly to your home with strict hygiene standards.",
    specialties: ["Textured Fades", "Beard Sculpting", "Ayurvedic Head Massage"],
  },
  {
    id: "pro-4",
    name: "Pooja Hegde",
    trade: "Certified Aesthetician",
    serviceId: "beauty",
    rating: 4.9,
    reviewsCount: 640,
    completedJobs: 1650,
    experienceYears: 8,
    image: require("../../assets/images/beauty.jpg"),
    hourlyRate: "₹499/service",
    verified: true,
    city: "Bengaluru",
    bio: "CIDESCO-trained beauty specialist offering soothing facials, salon-grade mani-pedis, and organic waxing using disposable sterile kits.",
    specialties: ["De-tan Facials", "Gel Manicures", "Bridal Glow Therapy"],
  },
  {
    id: "pro-5",
    name: "Mohammad Yusuf",
    trade: "Senior Carpenter",
    serviceId: "carpenter",
    rating: 4.8,
    reviewsCount: 180,
    completedJobs: 520,
    experienceYears: 12,
    image: require("../../assets/images/carpenter.jpg"),
    hourlyRate: "₹349/hr",
    verified: true,
    city: "Bengaluru",
    bio: "Master woodworker with 12 years of craftsmanship in modular kitchen alignments, custom storage installations, and antique restoration.",
    specialties: ["Hydraulic Beds", "Lock Replacements", "Modular Drawer Slides"],
  },
  {
    id: "pro-6",
    name: "Pawan Verma",
    trade: "Licensed Plumber",
    serviceId: "plumber",
    rating: 4.9,
    reviewsCount: 410,
    completedJobs: 1100,
    experienceYears: 9,
    image: require("../../assets/images/plumber.jpg"),
    hourlyRate: "₹249/visit",
    verified: true,
    city: "Bengaluru",
    bio: "Rapid-response plumbing specialist equipped with high-pressure diagnostic pumps for leak detection and clean sanitary line repairs.",
    specialties: ["Faucet Replacements", "Clog Clearance", "Concealed Leak Fix"],
  },
];
