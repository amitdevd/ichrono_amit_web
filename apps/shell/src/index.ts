// @ichrono/shell – app-wide wiring shared by all portals.
// The entry route (src/app/index.tsx) sends visitors to the User Web home,
// or signed-in dealers/admins to their dashboards.
export { default as RoleGate } from './RoleGate';
