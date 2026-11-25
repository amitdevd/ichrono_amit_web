# Andy Dev Design – Web & App (Expo)

Front-end for the Andy Dev Design luxury-watch marketplace: **User Web**, **Dealer Web** and the **Admin panel**,
recreated from the Laravel Blade templates in `backend_ref/`. Built with Expo Router (React Native + web).

> Status: front-end only. All data is demo data (`src/data`) and kept in memory / browser storage.
> No backend APIs are called yet.

---

## 1. Run it

```bash
npm install
npx expo start --web     # or: npm run web
npx tsc --noEmit         # typecheck
npx expo lint            # lint
```

### Demo logins (any password works)

| Portal | Login URL | Example | After login |
|---|---|---|---|
| User   | `/login` (or "Login/Register" on `/`) | `user@test.com` | `/home` |
| Dealer | `/dealer/login` | `dealer@test.com` | `/dealer/dashboard` |
| Admin  | `/admin/login` (tick the Terms box) | `admin@test.com` | `/admin/dashboard` |

OTP screens accept any 4 digits. New passwords need 8+ characters with upper, lower, number and symbol (e.g. `Abcd@123`).

---

## 2. Change the theme colours (one place)

Edit **`theme.config.ts`** (project root):

```ts
primary:     '#003A4E'  // navbars, sidebars, headings, main buttons, table headers
secondary:   '#A8824F'  // gold buttons, links, active steps
accentLight: '#E2C07C'  // active menu text, footer headings
```

All shades (borders, light backgrounds, hover colours, text greys) are calculated from these in
`packages/theme/src/index.ts`. Never type a hex colour in a screen – use `Palette.*`
(and `tint`, `shade`, `withAlpha` from `@ichrono/theme` for a custom shade).

---

## 3. Project map

```
theme.config.ts          ← brand colours (the only place to change them)
backend_ref/             ← Laravel reference (read-only, do not edit)
assets/images/           ← images (brand-logo*.png / .svg = logo, icon.png + favicon.png = app & tab icons)

packages/                ← shared code used by every portal
  theme/   @ichrono/theme   Palette (built from theme.config.ts), fonts, spacing, radius
  auth/    @ichrono/auth    AuthProvider, useAuth, demo login/logout, session restore
  ui/      @ichrono/ui      building blocks: Btn, Field, SelectField, MultiSelectField,
                            DateField, CheckBox/Radio/ToggleSwitch, OptionChips, RangeSlider,
                            OtpInput, AppModal, DataTable, image upload, Icon, useBreakpoint

apps/                    ← one "map" per portal: lists every screen in milestone order
  user/  dealer/  admin/    (src/index.ts)
  shell/                    RoleGate (role-based guard)

src/
  app/                   ← ROUTES ONLY (Expo Router: every file is a URL)
    index.tsx              "/" → User home (or dashboard if a dealer/admin is signed in)
    (auth)/                User login, register, OTP, forgot/create password
    (onboarding)/          "Hey There" 5 questions after register
    (tabs)/                User home + profile (bottom tabs on phones)
    seller/                Set up as Private seller (documents → address → bank → review)
    seller/listing/        "List Your Watch" steps one … six (M3)
    dealer/                Dealer login, signup wizard, forgot password
    dealer/(panel)/        Dealer pages with header + sidebar
    admin/                 Admin login, forgot password, OTP, create password
    admin/(panel)/         Admin pages with top bar + sidebar
  components/            ← portal-specific pieces (frames, shells, cards)
    user/  dealer/  admin/
    listing/               create-listing pieces shared by User Web + Dealer (steps, search, details)
    index.ts               forwards to @ichrono/ui
  context/               ← front-end state: seller setup, dealer signup, admin data, listings, site content (banners, brands)
  data/                  ← demo data: common, user, dealer, admin, listings (+ watch catalogue), users
  utils/                 ← small helpers (CSV export)
  hooks/                 ← app hooks (guest guard, colour scheme)
  constants/             ← theme forward + brand logo
```

### Where does new code go?

| You are adding… | Put it in |
|---|---|
| A new page / URL | `src/app/...` (+ add it to `apps/<portal>/src/index.ts` under its milestone) |
| A reusable control (input, button, table…) | `packages/ui/src/` + export it in `packages/ui/src/index.ts` |
| A piece used by one portal only | `src/components/<user\|dealer\|admin>/` |
| Demo data | `src/data/<portal>.ts` |
| Shared front-end state | `src/context/` |
| A colour | don't – use `Palette.*` (or change `theme.config.ts`) |

Imports: shared controls `from '@ichrono/ui'`, colours/spacing `from '@/constants/theme'`,
auth `from '@/context/auth-context'`, data `from '@/data'`.

---

## 4. Screens by milestone

The full list with file names is in `apps/user`, `apps/dealer` and `apps/admin` (`src/index.ts`).

**Milestone 1**
- User Web: home `/home`; login, register, email OTP, forgot/reset password; onboarding `/step-one`…`/step-five`
- Dealer: `/dealer/login`; signup wizard `/dealer/register` → `/dealer/verify-otp` → `/dealer/step-three` → `step-four` → `step-five` → `step-six`;
  forgot password → `reset-otp` → `reset-password`; `/dealer/dashboard`
- Admin: login, forgot password, OTP, create password; `/admin/dashboard`, `/admin/brands-management`,
  `/admin/watch-management`, `/admin/dealer-management`

**Milestone 2**
- User Web: Apple/Facebook/Google login (demo), guest mode (home only – any action → login),
  private-seller setup `/profile` → `/seller/documents` → `/seller/address` → `/seller/bank` → `/seller/review`
- Dealer: `/dealer/listing-settings` (shipping costs, excluded countries, taxation, order confirmation, currency)
- Admin: `/admin/watch-setting`, `/admin/country-management-settings` (+ per continent), `/admin/banner`

**Milestone 3**
- User Web: `/profile` Listing / Drafts / Orders (details, edit, delete, add to list);
  create listing `/seller/create-listing` → search results `/seller/start-selling` ("Sell" modal) or add manually →
  `/seller/listing/step-one` … `step-six` (information, photos, proof of ownership, conditions, description, draft / submit)
- Dealer: `/dealer/listings` (Drafts / Live / Pending / Rejected, totals, analytics, sort, filter, live switch);
  `/dealer/create-listing` → `/dealer/get-listing` → `/dealer/product-details` or `/dealer/listing-info` →
  `add-information` → `add-image` → `add-ownership` → `add-condition` → `add-description` → `thanku`
- Admin: `/admin/user-management` (users; private sellers approved / verification / rejected),
  `/admin/product-management` (User / Admin / Dealer; approve, reject, details, edit, add new watch + condition)

How the M3 demo hangs together: listings live in one store (`src/context/listings.tsx`, saved in the
browser). A listing submitted by the user or a dealer appears in admin → Product Management →
Verification; approving / rejecting it updates the user's profile and the dealer's Listings.
A private-seller application submitted on `/seller/review` appears in admin → User Management →
Private Seller → Verification, and approving it unlocks "Create Listing" on the user's profile.

**Milestone 4** (only what `backend_ref` has a page for)
- User Web home `/home` is live: the banner carousel shows admin → Banners that are active and running
  today; "Recommended For You" shows approved listings on sale (private sellers get the badge);
  "Popular Brands" shows the active brands from admin → Brands and "Display All Brands" expands the list.
- Drafts (user profile, dealer Listings) and admin "Add New Watch" with all steps were delivered in Milestone 3.
- Not built – no design in `backend_ref`: search results / saved searches, feeds with 3 view modes,
  category pages, recently viewed, dealer View/Edit Profile, admin Commission Fees.

**Later milestones** show a "Scheduled for Milestone X" placeholder in the menus.
