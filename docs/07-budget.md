# Finance Tracker SaaS

## Part 7 — Budget System

# Objective

Build a premium budgeting system inspired by:

* YNAB
* Monarch Money
* Copilot Money

The budget system should not only track spending, but actively help users manage and improve their finances.

The experience should feel interactive, intelligent, and effortless.

---

# Budget Philosophy

Budgets should be:

* Easy to configure
* Easy to understand
* Continuously updated
* Visually informative
* Predictive rather than reactive

Every expense should immediately affect the relevant budget.

---

# Monthly Budget

Each expense category has its own monthly budget.

Examples:

Food & Water

Rp1.478.985

Housing

Rp800.000

Transportation

Rp700.000

Internet

Rp300.000

Entertainment

Rp600.000

Emergency

Rp300.000

Personal Care

Rp200.000

Household

Rp200.000

Users may:

* Edit
* Delete
* Disable
* Archive
* Duplicate
* Reset

---

# Budget Card

Each category displays:

Category Icon

Category Name

Monthly Budget

Current Spending

Remaining Budget

Percentage Used

Progress Bar

Status Badge

Forecast

Quick Edit Button

---

# Budget Slider

Every category includes a slider.

Use:

shadcn Slider

Range

Rp0

↓

Rp5.000.000

Step

Rp50.000

The slider updates:

Budget

Remaining

Dashboard

Analytics

Charts

Forecast

Financial Health

Instantly.

No page refresh.

---

# Precise Budget Input

Below the slider, provide an editable currency input.

Requirements:

Auto-format currency while typing.

Example:

1478985

↓

Rp1.478.985

Allow values:

Rp0

↓

Rp999.999.999

If the amount exceeds Rp5.000.000:

The slider stays at its maximum.

The actual budget uses the typed value.

The slider and input remain synchronized whenever possible.

---

# Budget Progress

Display:

Current Spending

Remaining

Percentage

Forecast

Progress Bar

Color

Status

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

Transition smoothly.

---

# Budget Forecast

Predict:

Estimated end-of-month spending.

Estimated remaining budget.

Estimated overspending.

Display:

Current Spending

Forecast Spending

Difference

Confidence Level

Confidence:

Low

Medium

High

---

# Budget Insights

Examples:

"You are spending slower than last month."

"You are likely to exceed your Food budget."

"You have already used 92% of your Transportation budget."

"Entertainment spending is significantly lower than usual."

---

# Budget Warnings

Display notifications when:

70%

85%

100%

Exceeded

Warnings appear on:

Dashboard

Budget Page

Notifications

---

# Category Detail

Clicking a budget opens:

Monthly Spending

Daily Spending

Remaining

Trend

Previous Months

Transactions

Forecast

Insights

---

# Budget Templates

Built-in templates:

Minimal Living

Balanced

Aggressive Saving

Family

Student

Luxury

Users may:

Create

Rename

Duplicate

Delete

Share (future)

---

# Budget Recommendations

Automatically recommend budgets using previous spending.

Example:

Average Food Spending:

Rp1.320.000

Suggested Budget:

Rp1.500.000

One-click Apply.

---

# Budget History

Display previous months.

Example:

January

Budget

Spent

Remaining

Status

Trend

---

# Monthly Comparison

Compare:

Current Month

Previous Month

Previous Year

Display:

Increase

Decrease

Percentage

---

# Budget Rollover

Allow unused budget to roll into the next month.

Options:

Disabled

Carry Remaining

Carry Percentage

Custom Amount

---

# Overspending

Display:

Exceeded Amount

Days Remaining

Recommended Reduction

Suggested Categories

---

# Live Simulation

While editing a budget:

Update in real time:

Remaining Budget

Progress Bar

Dashboard Cards

Forecast

Financial Health

Pie Chart

Analytics

No save required until confirmation.

---

# Reset Options

Support:

Reset One Category

Reset Entire Month

Restore Defaults

Confirmation dialog required.

---

# Budget Lock

Allow users to lock a budget.

Locked budgets require confirmation before editing.

---

# Category Ordering

Support drag & drop.

Users may:

Reorder categories.

Pin favorites.

Hide unused categories.

Save custom order.

---

# Budget Search

Search categories instantly.

Search by:

Name

Icon

Status

Budget

---

# Budget Filters

Show:

Over Budget

Near Limit

Healthy

Archived

Hidden

---

# Budget Analytics

Display:

Total Budget

Total Spent

Remaining Budget

Average Category Usage

Highest Budget

Lowest Budget

Most Overspent

Least Used

---

# Budget Dashboard

Top Summary:

Total Budget

Total Spent

Remaining

Forecast

Savings Opportunity

Below:

Category Cards

Charts

Recommendations

Warnings

History

---

# Charts

Display:

Budget Allocation (Pie)

Budget vs Actual (Bar)

Monthly Budget Trend (Line)

Forecast Trend (Area)

---

# Notifications

Examples:

"Food budget exceeded."

"Transportation reached 85%."

"You saved Rp420.000 this month."

"Unused budget can roll over."

---

# Accessibility

Keyboard support.

Screen readers.

Visible focus.

Accessible sliders.

Accessible charts.

---

# Performance

Debounce input.

Memoize calculations.

Virtualize long category lists.

Avoid unnecessary re-renders.

---

# Integration

Budget changes instantly update:

Dashboard

Analytics

Reports

Financial Health

Forecast

Goals

AI Insights

---

# Deliverables for Part 7

By the end of this phase:

* Budget Cards
* Budget Slider
* Precise Currency Input
* Budget Forecast
* Budget History
* Budget Templates
* Budget Recommendations
* Budget Analytics
* Overspending Detection
* Rollover Budgets
* Budget Dashboard
* Drag & Drop Categories
* Budget Notifications
* Live Simulation
* Responsive UI

The budgeting experience should feel interactive, intelligent, and suitable for users who actively manage their finances every day.

End of Part 7.
