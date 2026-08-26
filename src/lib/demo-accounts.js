/** Local dashboard logins — development shortcuts only. Passwords are not for production. */
export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    username: 'admin',
    email: 'admin@example.com',
    password: 'AdminShare1!',
    dashboard: '/dashboard/admin',
    label: 'Admin',
  },
  {
    role: 'donor',
    username: 'donor',
    email: 'donor@local.dev',
    password: 'ShareLocal1!',
    dashboard: '/dashboard/donor',
    label: 'Donor',
  },
  {
    role: 'recipient',
    username: 'recipient',
    email: 'recipient@local.dev',
    password: 'ShareLocal1!',
    dashboard: '/dashboard/recipient',
    label: 'Recipient',
  },
  {
    role: 'volunteer',
    username: 'volunteer',
    email: 'volunteer@local.dev',
    password: 'ShareLocal1!',
    dashboard: '/dashboard/volunteer',
    label: 'Volunteer',
  },
];

export const showDemoAuthShortcuts = import.meta.env.DEV === true;

export function dashboardPathForRole(role) {
  if (role === 'donor') return '/dashboard/donor';
  if (role === 'recipient') return '/dashboard/recipient';
  if (role === 'volunteer') return '/dashboard/volunteer';
  if (role === 'admin') return '/dashboard/admin';
  return '/';
}
