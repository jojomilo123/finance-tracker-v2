# Finance Tracker SaaS

## Document 14 — AI Operating Manual

# Purpose

This document defines the operational workflow that the AI must follow throughout the project.

It is NOT a feature specification.

It is NOT an architecture document.

It defines how the AI should think, plan, implement, review, and improve the application.

This document applies to every task.

Never ignore it.

---

# Core Mission

Your mission is not to generate code.

Your mission is to build and maintain a production-quality SaaS application.

Every decision should improve the project.

Never optimize for speed over quality.

---

# Development Philosophy

Think first.

Plan second.

Implement third.

Review fourth.

Refactor fifth.

Only then continue.

Never skip these steps.

---

# Rule 1 — Understand Before Coding

Before writing any code:

Read the relevant documentation.

Understand the architecture.

Understand the existing implementation.

Understand the current feature.

Never begin coding immediately.

---

# Rule 2 — Always Inspect Existing Code

Before creating:

Component

Hook

Utility

Store

Context

Service

Schema

Validation

Search the project first.

Reuse existing implementations whenever possible.

---

# Rule 3 — Never Duplicate

Never duplicate:

Components

Business Logic

Validation

Utility Functions

Database Queries

API Logic

Hooks

If similar logic already exists:

Extend it.

Do not recreate it.

---

# Rule 4 — Planning Phase

Before implementing medium or large changes:

Produce a short implementation plan.

Include:

Files to modify

Files to create

Components affected

Database impact

UI impact

Potential risks

Then begin implementation.

---

# Rule 5 — Work Incrementally

Implement one feature at a time.

Complete it.

Verify it.

Only then continue.

Never partially implement multiple features simultaneously.

---

# Rule 6 — Keep Project Runnable

After every task:

The application must still:

Compile

Run

Build

Navigate correctly

Never leave the project broken.

---

# Rule 7 — Respect Existing Architecture

Do not replace architecture without necessity.

Do not move files unnecessarily.

Do not rename modules without reason.

Do not reorganize folders unless it clearly improves maintainability.

---

# Rule 8 — UI Consistency

Always use:

shadcn/ui

Existing components

Existing spacing

Existing typography

Existing color system

Never invent a second design language.

---

# Rule 9 — Performance Awareness

Before introducing new logic:

Consider:

Performance

Rendering cost

Database queries

Bundle size

Memory usage

Avoid unnecessary complexity.

---

# Rule 10 — Database Safety

Never perform destructive database changes casually.

Always preserve data integrity.

Prefer migrations over manual modifications.

Protect financial records.

---

# Rule 11 — Error Handling

Every new feature should include:

Loading State

Empty State

Error State

Success State

Retry State (where appropriate)

---

# Rule 12 — Accessibility

Every UI change must preserve:

Keyboard Navigation

ARIA Labels

Semantic HTML

Focus Management

Reduced Motion support

Accessibility is part of the implementation, not a later improvement.

---

# Rule 13 — Responsive First

Every page must work on:

Desktop

Laptop

Tablet

Mobile

Do not postpone responsiveness.

---

# Rule 14 — Security Awareness

Before writing backend logic:

Validate:

Authentication

Authorization

Ownership

Input

Output

Never trust client data.

---

# Rule 15 — Refactor Continuously

If duplication appears:

Refactor immediately.

Do not wait until the project becomes difficult to maintain.

---

# Rule 16 — Naming

Use descriptive names.

Never use:

temp

new

new2

final

fixed

component-new

Use names that describe purpose.

---

# Rule 17 — Review After Every Task

After implementation:

Review:

Architecture

Maintainability

Performance

Accessibility

Security

Responsiveness

Type Safety

Consistency

Correct issues before moving on.

---

# Rule 18 — Build Verification

Every completed task must pass:

TypeScript

ESLint

Production Build

No exceptions.

---

# Rule 19 — Documentation

Whenever architecture changes:

Update documentation.

Never allow documentation to become outdated.

---

# Rule 20 — Explain Significant Decisions

When making an architectural decision:

Briefly explain:

Why the approach was chosen.

What alternatives were considered.

How it fits the project architecture.

Keep explanations concise.

---

# Rule 21 — Do Not Overengineer

Avoid unnecessary abstractions.

Avoid creating systems that are not yet needed.

Keep the architecture scalable but practical.

---

# Rule 22 — Preserve User Experience

Every change should improve:

Speed

Clarity

Consistency

Feedback

Predictability

Never sacrifice UX for implementation convenience.

---

# Rule 23 — Think Like a Senior Engineer

Before writing code, ask internally:

Is this reusable?

Is this scalable?

Is this maintainable?

Will another engineer understand it?

Can this be tested?

If the answer is "no", improve the design first.

---

# Rule 24 — Completion Checklist

Before considering a task complete:

✓ Project builds successfully

✓ TypeScript passes

✓ ESLint passes

✓ Responsive

✓ Accessible

✓ Dark mode supported

✓ No duplicated code

✓ Existing features still work

✓ Documentation updated if necessary

✓ No TODO comments

✓ No placeholder implementations

Only after every item passes may the task be considered complete.

---

# Rule 25 — Never Rush

Quality is more important than speed.

A slower, cleaner implementation is always preferred over a faster, fragile one.

Build software that can still be maintained years from now.

---

# Standard Workflow

For every task, follow this sequence:

1. Read the relevant documents.

2. Understand the existing implementation.

3. Inspect reusable components.

4. Create an implementation plan.

5. Wait for approval if the change is significant.

6. Implement incrementally.

7. Review your own work.

8. Refactor if necessary.

9. Verify build, lint, and type checks.

10. Ensure the application remains production-ready.

---

# Final Operating Principle

Act as a long-term technical partner, not merely a code generator.

Every change should leave the project cleaner, more consistent, and easier to maintain than before.

The quality of the system is more important than the quantity of code.

End of AI Operating Manual.
