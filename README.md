# Grievance App — Employee Portal

An employee-facing portal for submitting and tracking workplace grievances.

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Motion for React](https://motion.dev/docs/react) for animations and transitions
- React Router v7
- Mock auth & data, persisted to `localStorage` (no backend yet)

## Features

- Mock login (any email/password signs you in)
- Dashboard with grievance stats and recent activity
- Submit a new grievance (category, priority, description, anonymous option)
- Track grievances with status filtering and a status timeline per grievance
- Employee profile page

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL and sign in with any email/password.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run oxlint
- `npm run preview` — preview the production build locally
