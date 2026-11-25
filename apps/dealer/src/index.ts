// @ichrono/dealer – Dealer Web screens, in milestone order.
// Routes live in src/app/dealer; this list is the map of the portal.

// ── Milestone 1 ─────────────────────────────────────────────── URL
export { default as DealerLoginScreen } from '@/app/dealer/login'; //              /dealer/login
// Create account wizard (in order)
export { default as DealerRegisterScreen } from '@/app/dealer/register'; //        /dealer/register    1  account + mobile OTP
export { default as DealerVerifyOtpScreen } from '@/app/dealer/verify-otp'; //     /dealer/verify-otp     email OTP
export { default as DealerStepThreeScreen } from '@/app/dealer/step-three'; //     /dealer/step-three  2  address & business ids
export { default as DealerStepFourScreen } from '@/app/dealer/step-four'; //       /dealer/step-four   3  bank details
export { default as DealerStepFiveScreen } from '@/app/dealer/step-five'; //       /dealer/step-five   4  documents
export { default as DealerStepSixScreen } from '@/app/dealer/step-six'; //         /dealer/step-six    5  summary + submit
// Forgot password (in order)
export { default as DealerForgotPasswordScreen } from '@/app/dealer/forgot-password'; // /dealer/forgot-password
export { default as DealerResetOtpScreen } from '@/app/dealer/reset-otp'; //       /dealer/reset-otp
export { default as DealerResetPasswordScreen } from '@/app/dealer/reset-password'; // /dealer/reset-password
// Panel
export { default as DealerDashboardScreen } from '@/app/dealer/(panel)/dashboard'; // /dealer/dashboard

// ── Milestone 2 ─────────────────────────────────────────────── URL
export { default as DealerListingSettingsScreen } from '@/app/dealer/(panel)/listing-settings'; // /dealer/listing-settings

// ── Milestone 3 ─────────────────────────────────────────────── URL
export { default as DealerListingsScreen } from '@/app/dealer/(panel)/listings'; //           /dealer/listings  Drafts / Live / Pending / Rejected
export { default as DealerCreateListingScreen } from '@/app/dealer/(panel)/create-listing'; // /dealer/create-listing
export { default as DealerGetListingScreen } from '@/app/dealer/(panel)/get-listing'; //       /dealer/get-listing?search=
export { default as DealerProductDetailsScreen } from '@/app/dealer/(panel)/product-details'; // /dealer/product-details?id=
export { default as DealerListingInfoScreen } from '@/app/dealer/(panel)/listing-info'; //     /dealer/listing-info   brand / model / ref
export { default as DealerAddInformationScreen } from '@/app/dealer/(panel)/add-information'; // /dealer/add-information?id=
export { default as DealerAddImageScreen } from '@/app/dealer/(panel)/add-image'; //           /dealer/add-image?id=
export { default as DealerAddOwnershipScreen } from '@/app/dealer/(panel)/add-ownership'; //   /dealer/add-ownership?id=
export { default as DealerAddConditionScreen } from '@/app/dealer/(panel)/add-condition'; //   /dealer/add-condition?id=
export { default as DealerAddDescriptionScreen } from '@/app/dealer/(panel)/add-description'; // /dealer/add-description?id=
export { default as DealerThankYouScreen } from '@/app/dealer/(panel)/thanku'; //              /dealer/thanku
