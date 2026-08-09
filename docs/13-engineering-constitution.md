# Finance Tracker SaaS

## Document 13 — Engineering Constitution

# Purpose

This document defines the permanent engineering principles for the project.

Every implementation decision must follow this constitution.

These rules are intended to ensure:

* Long-term maintainability
* Scalability
* Consistency
* Reliability
* High code quality

This document takes precedence over implementation shortcuts.

---

# Principle 1 — Architecture First

Never optimize for speed of implementation if it significantly harms architecture.

Prefer solutions that remain maintainable over the next several years.

Every new feature should fit naturally into the existing architecture.

---

# Principle 2 — Reuse Before Create

Before creating any file:

Search existing:

Components

Hooks

Utilities

Services

Stores

Types

Providers

If an existing solution satisfies the requirement:

Reuse it.

Never duplicate functionality.

---

# Principle 3 — One Responsibility

Every file should have one primary responsibility.

Examples:

Components render UI.

Hooks manage reusable client logic.

Services contain business logic.

Utilities contain pure helper functions.

Validation stays inside schemas.

Database access remains separated.

Never mix these responsibilities.

---

# Principle 4 — Feature Based Structure

Organize code by feature.

Avoid placing unrelated logic together.

Each feature should contain:

Components

Hooks

Types

Validation

Services

Tests

Future developers should immediately understand the project structure.

---

# Principle 5 — Type Safety

Strict TypeScript.

Never disable type checking.

Avoid:

any

unknown abuse

type assertions without justification

Prefer inferred types whenever possible.

---

# Principle 6 — Consistent Design

Always use:

shadcn/ui

Preset:

b2BpmItQ8

Never mix UI libraries.

Never build custom UI if an official component already exists.

Maintain one visual language.

---

# Principle 7 — Accessibility

Every feature must support:

Keyboard navigation

Focus management

ARIA labels

Semantic HTML

High contrast

Reduced motion

Accessibility is not optional.

---

# Principle 8 — Responsive by Default

Every page must support:

Desktop

Laptop

Tablet

Mobile

Never treat responsiveness as a later task.

---

# Principle 9 — Performance

Avoid unnecessary re-renders.

Memoize expensive calculations.

Lazy-load heavy components.

Virtualize large lists.

Use Server Components where practical.

Keep bundles as small as possible.

---

# Principle 10 — Security

Never trust client input.

Validate everything.

Protect:

Authentication

Authorization

Database queries

File uploads

Environment variables

Never expose secrets.

---

# Principle 11 — Database Integrity

Never bypass Prisma.

Use migrations.

Preserve referential integrity.

Avoid destructive schema changes.

Financial records should be immutable whenever practical.

If corrections are needed, prefer adjustments or reversal records over silent edits.

---

# Principle 12 — Error Handling

Every async operation must handle:

Loading

Success

Failure

Unexpected exceptions

Never leave users without feedback.

---

# Principle 13 — State Management

Use local state first.

Use Zustand only for shared application state.

Do not place server data in global state unless there is a clear benefit.

---

# Principle 14 — Component Size

Recommended limits:

Component:

≤300 lines

Hook:

≤200 lines

Utility:

≤150 lines

Service:

≤250 lines

If a file grows beyond these limits:

Split it.

---

# Principle 15 — Naming

Use meaningful names.

Avoid:

temp

new

fixed

test2

final

component-new

Use names that describe purpose.

---

# Principle 16 — No Placeholder Code

Never leave:

TODO

FIXME

Dummy implementations

Fake services

Temporary hacks

Every committed feature should work.

---

# Principle 17 — Logging

Never leave debug logging in production.

Use structured logging where needed.

Avoid unnecessary console statements.

---

# Principle 18 — Testing

Code should be written to be testable.

Business logic should not depend directly on UI.

Pure functions should remain pure.

---

# Principle 19 — Documentation

When introducing:

Architecture

Database

Public APIs

Reusable systems

Update documentation.

Keep documentation synchronized with implementation.

---

# Principle 20 — Backward Compatibility

Never break existing features without a strong reason.

If a breaking change is unavoidable:

Document it.

Provide migration guidance.

Update affected components consistently.

---

# Principle 21 — User Experience

Every interaction should provide clear feedback.

Examples:

Loading

Saving

Saved

Error

Retry

Undo

Users should never wonder what is happening.

---

# Principle 22 — Financial Accuracy

Money calculations must prioritize correctness.

Avoid floating-point precision issues.

Use a consistent money representation throughout the application.

Ensure totals, reports, budgets, and forecasts derive from the same source of truth.

---

# Principle 23 — Single Source of Truth

Each piece of information should have one authoritative source.

Avoid duplicated calculations.

Avoid duplicated business rules.

Shared logic belongs in reusable services or utilities.

---

# Principle 24 — Future Extensibility

Every major module should be designed for future expansion.

Examples:

Multi-user

Family accounts

Bank integrations

OCR

AI providers

Multi-currency

Plugins

Do not hardcode assumptions that block future growth.

---

# Principle 25 — Review Before Completion

Before considering any task complete:

* Project builds successfully.
* No TypeScript errors.
* No ESLint errors.
* No broken imports.
* No broken routes.
* Responsive verified.
* Dark mode verified.
* Accessibility verified.
* Existing functionality verified.
* New functionality integrated.
* Documentation updated if needed.

Only then is the task considered complete.

---

# Final Engineering Oath

Every implementation must improve the project.

Never sacrifice maintainability for short-term speed.

Build software that another engineer can confidently understand, extend, and maintain years from now.

The application should be worthy of production deployment and commercial use.

End of Engineering Constitution.
