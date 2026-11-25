// @ichrono/admin – Admin panel screens, in milestone order.
// Routes live in src/app/admin; this list is the map of the portal.

// ── Milestone 1 ─────────────────────────────────────────────── URL
export { default as AdminLoginScreen } from '@/app/admin/login'; //                    /admin/login
export { default as AdminForgotPasswordScreen } from '@/app/admin/forgot-password'; // /admin/forgot-password
export { default as AdminOtpVerifyScreen } from '@/app/admin/otp-verify'; //           /admin/otp-verify
export { default as AdminCreatePasswordScreen } from '@/app/admin/create-password'; // /admin/create-password
export { default as AdminSignupScreen } from '@/app/admin/signup'; //                  /admin/signup (not in backend_ref, unlinked)
export { default as AdminDashboardScreen } from '@/app/admin/(panel)/dashboard'; //    /admin/dashboard
export { default as BrandsManagementScreen } from '@/app/admin/(panel)/brands-management'; // /admin/brands-management
export { default as WatchCategoryScreen } from '@/app/admin/(panel)/watch-management'; //     /admin/watch-management
export { default as DealerManagementScreen } from '@/app/admin/(panel)/dealer-management'; // /admin/dealer-management

// ── Milestone 2 ─────────────────────────────────────────────── URL
export { default as WatchSettingScreen } from '@/app/admin/(panel)/watch-setting'; //  /admin/watch-setting
export { default as CountriesSettingScreen } from '@/app/admin/(panel)/country-management-settings/index'; // /admin/country-management-settings
export { default as ManageCountriesScreen } from '@/app/admin/(panel)/country-management-settings/[continent]'; // …/<continent>
export { default as BannerManagementScreen } from '@/app/admin/(panel)/banner'; //     /admin/banner

// ── Milestone 3 ─────────────────────────────────────────────── URL
export { default as UserManagementScreen } from '@/app/admin/(panel)/user-management'; //  /admin/user-management (users + private sellers)
export { default as ProductManagementScreen } from '@/app/admin/(panel)/product-management/index'; // /admin/product-management
export { default as AddProductScreen } from '@/app/admin/(panel)/product-management/add'; //            …/add
export { default as WatchConditionScreen } from '@/app/admin/(panel)/product-management/watch-condition'; // …/watch-condition?id=
export { default as ProductDetailsScreen } from '@/app/admin/(panel)/product-management/details'; //    …/details?id=
export { default as EditProductScreen } from '@/app/admin/(panel)/product-management/update'; //        …/update?id=
