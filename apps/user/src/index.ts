// @ichrono/user – User Web (customer marketplace) screens, in milestone order.
// Routes live in src/app; this list is the map of the portal.

// ── Milestone 1 ─────────────────────────────────────────────── URL
export { default as HomeScreen } from '@/app/(tabs)/home'; //                 /home  (live sections: Milestone 4)
export { default as UserLoginScreen } from '@/app/(auth)/login'; //           /login
export { default as UserRegisterScreen } from '@/app/(auth)/register'; //     /register
export { default as UserOtpVerifyScreen } from '@/app/(auth)/otp-verify'; //  /otp-verify   (register + forgot password)
export { default as UserForgotPasswordScreen } from '@/app/(auth)/forgot-password'; // /forgot-password
export { default as UserCreatePasswordScreen } from '@/app/(auth)/create-password'; // /create-password
export { default as OnboardingStepOne } from '@/app/(onboarding)/step-one'; //     /step-one … /step-five ("Hey There")
export { default as OnboardingStepTwo } from '@/app/(onboarding)/step-two';
export { default as OnboardingStepThree } from '@/app/(onboarding)/step-three';
export { default as OnboardingStepFour } from '@/app/(onboarding)/step-four';
export { default as OnboardingStepFive } from '@/app/(onboarding)/step-five';

// ── Milestone 2 ─────────────────────────────────────────────── URL
// Social login + guest mode live inside the login/home screens above.
export { default as ProfileScreen } from '@/app/(tabs)/profile'; //                 /profile        (Sell a Watch / seller status)
export { default as SellerDocumentsScreen } from '@/app/seller/documents'; //       /seller/documents  step 1
export { default as SellerAddressScreen } from '@/app/seller/address'; //           /seller/address    step 2
export { default as SellerBankScreen } from '@/app/seller/bank'; //                 /seller/bank       step 3
export { default as SellerReviewScreen } from '@/app/seller/review'; //             /seller/review     preview, edit, submit

// ── Milestone 3 ─────────────────────────────────────────────── URL
// "My listings" (Listing / Drafts / Orders) is part of ProfileScreen above.
export { default as CreateListingScreen } from '@/app/seller/create-listing'; //    /seller/create-listing  search + tutorial
export { default as StartSellingScreen } from '@/app/seller/start-selling'; //      /seller/start-selling   results + "Sell" modal
export { default as ListingStepOne } from '@/app/seller/listing/step-one'; //       /seller/listing/step-one?id=   brand / model / ref
export { default as ListingStepTwo } from '@/app/seller/listing/step-two'; //       …/step-two    information
export { default as ListingStepThree } from '@/app/seller/listing/step-three'; //   …/step-three  photos
export { default as ListingStepFour } from '@/app/seller/listing/step-four'; //     …/step-four   proof of ownership
export { default as ListingStepFive } from '@/app/seller/listing/step-five'; //     …/step-five   conditions
export { default as ListingStepSix } from '@/app/seller/listing/step-six'; //       …/step-six    description, draft / submit

// ── Mobile app tabs (template placeholders) ─────────────────────
export { default as SearchScreen } from '@/app/(tabs)/search'; //                   mobile tab
export { default as SellScreen } from '@/app/(tabs)/sell'; //                       mobile tab
