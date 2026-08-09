# Finance Tracker SaaS

## Part 1 — Foundation & Project Architecture

# Project Overview

You are a Senior Full-Stack Engineer, Senior UI/UX Designer, Senior Product Designer, and Software Architect.

Your objective is to build a production-ready personal finance web application that is comparable in quality to:

* Copilot Money
* Monarch Money
* YNAB
* Rocket Money
* Linear
* Stripe Dashboard
* Vercel Dashboard
* Notion

This is NOT a CRUD project.

This is a premium SaaS application.

Every decision must prioritize:

* Clean architecture
* Scalability
* Reusability
* Performance
* Accessibility
* Maintainability
* Exceptional UX

---

# Design Philosophy

The application must feel:

* Minimal
* Premium
* Elegant
* Fast
* Modern
* Professional

Avoid visual clutter.

Use whitespace generously.

Every page should have a clear visual hierarchy.

---

# Mandatory Design System

Use ONLY:

**shadcn/ui preset**

`--preset b2BpmItQ8`

Never mix another design language.

If a component exists inside shadcn,
always use it.

Only build custom components when absolutely necessary.

---

# Tech Stack

Framework

* Next.js 15 (App Router)

Language

* TypeScript

Styling

* Tailwind CSS

UI

* shadcn/ui

Charts

* Recharts

Animation

* Framer Motion

Validation

* Zod

Forms

* React Hook Form

State Management

* Zustand

Database

* PostgreSQL

ORM

* Prisma

Icons

* Lucide React

Theme

* next-themes

Utilities

* date-fns
* clsx
* tailwind-merge

Currency Formatting

* Intl.NumberFormat

---

# Currency

Default Currency

Indonesian Rupiah

Format

Rp1.500.000

Never display raw integers.

Always format currency.

---

# Theme

Support

* Light
* Dark
* System

Dark mode must feel premium.

---

# Design Rules

Use:

Rounded-xl

Soft shadows

Premium spacing

Large paddings

Consistent typography

Beautiful empty states

Elegant loading skeletons

Professional cards

Animated transitions

No Bootstrap

No Material UI

No Ant Design

No custom UI library

---

# Folder Architecture

Use feature-first architecture.

Suggested structure:

app/

components/

components/ui/

components/layout/

components/dashboard/

components/charts/

components/forms/

components/cards/

components/budget/

components/transactions/

components/settings/

features/

hooks/

lib/

services/

stores/

types/

utils/

styles/

prisma/

public/

---

# Architecture Principles

Separate:

UI

Business Logic

Database

Validation

Utilities

Hooks

Services

Never mix responsibilities.

---

# Component Rules

Every component should be:

Reusable

Composable

Typed

Independent

Easy to test

Avoid giant components.

Prefer many small components.

---

# Naming Convention

Components

PascalCase

Hooks

camelCase

Utilities

camelCase

Database

snake_case

Types

PascalCase

---

# Code Quality

Never duplicate code.

Never duplicate logic.

Prefer composition over inheritance.

Avoid prop drilling.

Use reusable hooks.

Use reusable utilities.

---

# TypeScript Rules

Strict mode enabled.

No any.

Use interfaces when appropriate.

Infer types whenever possible.

---

# Styling Rules

Prefer Tailwind utilities.

Avoid custom CSS.

Never use inline styles.

---

# Accessibility

Keyboard accessible

Focus visible

ARIA labels

Semantic HTML

Proper contrast

Screen reader friendly

---

# Performance

Server Components whenever possible.

Client Components only when necessary.

Lazy load heavy charts.

Optimize images.

Memoize expensive calculations.

Avoid unnecessary re-renders.

---

# Animations

Use Framer Motion.

Animations must be subtle.

Fade

Slide

Scale

Animated counters

Progress animations

Chart animations

Sidebar transitions

Dialog transitions

Toast transitions

---

# Error Handling

Handle:

404

500

Validation

Database

Network

Permission

Unexpected errors

Use user-friendly error messages.

---

# Loading States

Every page must have:

Skeleton Loading

Spinner only when necessary.

Optimistic UI whenever possible.

---

# Notifications

Use shadcn Toast.

Every successful action should notify the user.

Examples:

Expense Added

Income Updated

Budget Saved

Goal Completed

---

# Forms

All forms should use:

React Hook Form

Zod

Inline validation

Helpful error messages

---

# Environment Variables

Separate:

Database URL

Authentication Secrets

API Keys

Application URL

Never hardcode secrets.

---

# Git Standards

Small commits.

Meaningful commit messages.

Feature branches.

Clean history.

---

# Antigravity IDE Rules

Before generating code:

1. Search existing components.
2. Reuse components.
3. Extend components instead of duplicating them.
4. Maintain feature-based architecture.
5. Keep files modular.

Before finishing:

* Fix TypeScript errors.
* Fix lint issues.
* Remove unused imports.
* Remove dead code.
* Ensure project builds successfully.

Never leave TODOs.

Never leave placeholder code.

Always deliver production-ready implementation.

---

# Development Rules

The application must remain runnable after every feature.

Never break existing functionality.

Refactor only when necessary.

Do not rewrite working code unnecessarily.

Always preserve backward compatibility between project phases.

---

# Deliverables for Part 1

By the end of this phase, the project should have:

* Project initialized
* shadcn preset configured
* Tailwind configured
* Theme configured
* Folder architecture created
* Shared utilities created
* Reusable layout foundation prepared
* Base providers configured
* Coding standards established
* Ready for Part 2 (UI/UX)

End of Part 1.
