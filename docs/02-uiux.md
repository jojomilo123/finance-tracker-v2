# Finance Tracker SaaS

## Part 2 — UI/UX System & Design Specification

# Objective

Design a premium personal finance application that feels comparable to:

* Linear
* Vercel Dashboard
* Stripe Dashboard
* Copilot Money
* Monarch Money
* Notion

The interface should immediately communicate professionalism, simplicity, and speed.

The design must prioritize clarity over decoration.

---

# Overall Design Language

Keywords:

* Minimal
* Premium
* Elegant
* Spacious
* Professional
* Modern
* Calm
* Fast

The UI should avoid visual noise.

Every screen should have one primary focus.

---

# Responsive Design

Support:

* Desktop (Primary)
* Laptop
* Tablet
* Mobile

Layouts must adapt smoothly without breaking cards or charts.

Never require horizontal scrolling on normal pages.

---

# Grid System

Use an 8px spacing system.

Spacing examples:

* 8px
* 16px
* 24px
* 32px
* 40px
* 48px

Never use inconsistent spacing.

---

# Border Radius

Use consistent rounded corners.

Default:

rounded-xl

Large dialogs:

rounded-2xl

Buttons:

rounded-lg

Charts:

rounded-xl

Cards:

rounded-xl

---

# Shadows

Soft shadows only.

Avoid heavy drop shadows.

Cards should appear elevated without looking bulky.

---

# Typography

Use one font family throughout.

Hierarchy:

Display

Heading

Title

Subtitle

Body

Caption

Use clear visual hierarchy.

Avoid excessive font weights.

---

# Color Philosophy

Primary accent from shadcn preset.

Neutral backgrounds.

Avoid saturated colors except for status indicators.

Status colors:

Success

Warning

Danger

Info

These should only be used for meaningful states.

---

# Icons

Use Lucide React.

Every navigation item should have an icon.

Icons must be consistent in size.

Do not mix icon libraries.

---

# Layout

Desktop Layout

---

Sidebar

↓

Top Navigation

↓

Dashboard Content

---

Content width should feel balanced.

Avoid stretching cards across the entire screen.

---

# Sidebar

Permanent on desktop.

Collapsible.

Floating appearance.

Contains:

Dashboard

Transactions

Income

Expenses

Budgets

Categories

Reports

Analytics

Calendar

Goals

Subscriptions

Net Worth

Settings

Bottom:

Theme Toggle

Profile

Logout

Current App Version

---

# Navbar

Contains:

Global Search

Quick Add

Notifications

Theme Toggle

Profile Dropdown

Breadcrumb

The navbar should stay fixed while scrolling.

---

# Dashboard Layout

Top

Summary Cards

↓

Financial Health

↓

Budget Overview

↓

Charts

↓

Recent Transactions

↓

Insights

↓

Warnings

↓

Upcoming Bills

↓

Goals

---

# Summary Cards

Display:

Total Balance

Income

Expense

Savings

Budget Remaining

Cards should include:

Icon

Title

Amount

Monthly Change

Mini Trend

Hover Animation

---

# Charts

Use Recharts.

Required:

Pie Chart

Bar Chart

Line Chart

Area Chart

Charts must animate on load.

Tooltips should be clean.

---

# Cards

Cards should include:

Title

Subtitle

Actions

Optional Menu

Loading Skeleton

Empty State

Hover State

---

# Buttons

Primary

Secondary

Ghost

Outline

Destructive

Icon Button

Loading Button

Buttons should have subtle hover and active animations.

---

# Inputs

Use shadcn components.

Support:

Currency

Date

Number

Text

Textarea

Search

Autocomplete

Select

Multi Select

---

# Tables

Modern data tables.

Features:

Sorting

Filtering

Pagination

Sticky Header

Row Hover

Selection

Bulk Actions

Responsive behavior

---

# Dialogs

Used for:

Create

Edit

Delete

Settings

Confirmation

All dialogs should support:

Escape

Outside Click

Keyboard Navigation

---

# Toast Notifications

Show after:

Save

Delete

Update

Import

Export

Budget Warning

Goal Completion

Recurring Transaction

---

# Loading Experience

Every page:

Skeleton Loading

Progressive Rendering

No blank screens.

---

# Empty States

Every empty page should display:

Illustration or icon

Helpful message

Primary action button

Example:

"No transactions yet."

"Create your first expense."

---

# Search Experience

Global search in navbar.

Shortcut:

Ctrl + K

Search:

Income

Expenses

Budgets

Categories

Goals

Reports

Settings

Results should appear instantly.

---

# Budget Cards

Each category displays:

Category Icon

Category Name

Current Spending

Monthly Budget

Remaining Budget

Progress Bar

Percentage Used

Budget Slider

Custom Budget Input

Status Badge

---

# Progress Colors

0–70%

Green

70–85%

Yellow

85–100%

Orange

Above 100%

Red

---

# Calendar

Monthly calendar.

Each day shows:

Income

Expense

Balance

Clicking a day opens detailed transactions.

---

# Analytics Page

Contains:

Expense Distribution

Income Distribution

Monthly Spending

Cash Flow

Category Comparison

Savings Rate

Budget Usage

Top Categories

Charts should be responsive.

---

# Reports

Weekly

Monthly

Yearly

Export:

CSV

Excel

PDF

JSON

---

# Settings

Currency

Theme

Notifications

Language (future-ready)

Account

Backup

Import

Export

Danger Zone

---

# Dark Mode

Dark mode should be first-class.

Never invert colors blindly.

Charts, cards, dialogs, and tables should remain highly readable.

---

# Motion Design

Use Framer Motion.

Animations:

Fade

Slide

Scale

Counter Animation

Chart Animation

Sidebar Animation

Page Transition

Dialog Transition

Progress Animation

Micro interactions should be smooth and subtle.

---

# Accessibility

Keyboard navigation.

Visible focus states.

Screen reader support.

High contrast.

Semantic HTML.

---

# UI Consistency Rules

Every page should reuse:

Cards

Buttons

Forms

Dialogs

Tables

Charts

Badges

Progress Bars

Avoid creating duplicate components.

---

# Deliverables for Part 2

At the end of this phase, the project should have:

* Complete design system
* Responsive layout
* Sidebar specification
* Navbar specification
* Dashboard layout specification
* Chart standards
* Card standards
* Form standards
* Table standards
* Motion guidelines
* Accessibility guidelines

The application should now have a complete visual blueprint ready for implementation.

End of Part 2.
