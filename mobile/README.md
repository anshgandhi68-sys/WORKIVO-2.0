# WORKIVO Mobile Application

Built with **React Native**, **Expo SDK 57**, **Expo Router**, and **TypeScript**.

## Brand Identity
* **Primary Deep Teal**: `#2F6860`
* **Dark Teal**: `#234F49`
* **Warm Cream Surface**: `#FBF1EE`
* **Vibrant Coral CTA**: `#E9847D`
* **Muted Coral**: `#8F453F`
* **Soft Green**: `#6BB26E`
* **Main Text**: `#1F2F2C`

## Structure
* `assets/images/`: Real worker photography and official Workivo hot-air balloon logo.
* `src/constants/theme.ts`: Design tokens, typography, radii, 3D tactile button shadows.
* `src/data/services.ts`: 10 core service stories with descriptions and tasks.
* `src/data/workers.ts`: Real verified marketplace worker profiles.
* `src/context/AppContext.tsx`: Role mode switcher (Customer / Worker Mode), bookings, and jobs state.
* `src/components/`:
  * `BrandLogo.tsx`: Official brand logo
  * `PrimaryButton.tsx`: Coral tactile 3D button
  * `SecondaryButton.tsx`: Cream and outline buttons
  * `Header.tsx`: Location, logo, mode toggle, notification
  * `ServiceStoryCard.tsx`: Service card with real photography and depth layers
  * `WorkerCard.tsx`: Marketplace profile card
  * `ThreeTapsSection.tsx`: 3-step value chain cards
  * `BookingModal.tsx`: Service booking flow with time-slot picker
  * `ServiceDetailModal.tsx`: Full tasks checklist and guarantees
  * `WorkerProfileModal.tsx`: Pro bio, reviews, and booking CTA
  * `OnboardingModal.tsx`: 3-slide onboarding tour
* `src/app/(tabs)/`:
  * `index.tsx`: Home / Worker Job Feed
  * `explore.tsx`: 10 Service Stories & Marketplace / Worker Schedule
  * `bookings.tsx`: Live Tracker / Worker Financials
  * `profile.tsx`: Mode Toggle, Preferences, Cloud Status

## Running the App
```bash
# In the mobile directory:
npm run start

# Specific platforms:
npm run android
npm run ios
npm run web
```
