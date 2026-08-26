/** Unique titles and meta descriptions for public and app routes. */
export const PAGE_META = {
  home: {
    title: 'Sustainashare | Turn surplus into verified community support',
    description:
      'Connect donors, recipients, and volunteers to list surplus, match needs, complete safe handovers, and measure only verified impact — with privacy by design.',
  },
  shop: {
    title: 'Browse surplus categories | Sustainashare',
    description:
      'Explore available surplus resource categories on Sustainashare. Redistribution first — not retail checkout.',
  },
  faqs: {
    title: 'FAQs | Sustainashare',
    description:
      'Answers about Sustainashare roles, privacy, donation verification, volunteer safety, and honest impact measurement.',
  },
  collection: {
    title: 'Surplus collection | Sustainashare',
    description: 'View surplus items in this category and start a verified donation journey on Sustainashare.',
  },
  product: {
    title: 'Surplus item detail | Sustainashare',
    description: 'Review surplus item details and how Sustainashare supports trusted redistribution.',
  },
  donorDashboard: {
    title: 'Donor dashboard | Sustainashare',
    description: 'Manage your surplus listings, fulfilment status, and verified impact receipts.',
  },
  recipientDashboard: {
    title: 'Recipient dashboard | Sustainashare',
    description: 'Track open needs, suitable matches, and handover confirmations privately.',
  },
  volunteerDashboard: {
    title: 'Volunteer dashboard | Sustainashare',
    description: 'View eligible assignments, accept tasks, and record verified handovers.',
  },
  adminDashboard: {
    title: 'Admin dashboard | Sustainashare',
    description: 'Moderate listings, oversee matching, handle exceptions, and review audit activity.',
  },
  reports: {
    title: 'Operational reports | Sustainashare',
    description: 'Administrator reports for verified fulfilments and platform operations.',
  },
};

export function metaForPath(pathname) {
  if (pathname === '/') return PAGE_META.home;
  if (pathname === '/faqs') return PAGE_META.faqs;
  if (pathname === '/shop') return PAGE_META.shop;
  if (pathname.startsWith('/shop/collection/') && pathname.split('/').length > 5) return PAGE_META.product;
  if (pathname.startsWith('/shop/collection/')) return PAGE_META.collection;
  if (pathname === '/dashboard/donor') return PAGE_META.donorDashboard;
  if (pathname === '/dashboard/recipient') return PAGE_META.recipientDashboard;
  if (pathname === '/dashboard/volunteer' || pathname === '/volunteer') return PAGE_META.volunteerDashboard;
  if (pathname === '/dashboard/admin') return PAGE_META.adminDashboard;
  if (pathname === '/dashboard/reports') return PAGE_META.reports;
  return PAGE_META.home;
}
