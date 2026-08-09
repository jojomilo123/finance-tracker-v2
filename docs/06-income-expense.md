# Finance Tracker SaaS

## Part 6 — Income, Expense & Transaction Management

# Objective

Build a premium transaction management system.

This is NOT a simple CRUD page.

Users should be able to manage every financial activity quickly, intuitively, and efficiently.

The experience should feel comparable to:

* Copilot Money
* Monarch Money
* YNAB
* Apple Wallet
* Linear

Every interaction should minimize friction.

---

# Core Philosophy

Users should be able to:

* Add a transaction in under 10 seconds.
* Search any transaction instantly.
* Filter thousands of transactions smoothly.
* Understand every expense clearly.
* Edit transactions without losing context.

---

# Transaction Types

Support:

* Income
* Expense
* Transfer

Transfer should move money between accounts without affecting total net worth.

---

# Income Module

Support full CRUD.

Fields:

* Title
* Amount
* Category
* Account
* Date
* Time
* Tags
* Notes
* Attachment
* Recurring
* Location (optional)

Default Categories:

* Salary
* Business
* Freelance
* Investment
* Bonus
* Gift
* Refund
* Other

Allow custom categories.

---

# Expense Module

Support full CRUD.

Fields:

* Title
* Amount
* Category
* Payment Method
* Account
* Merchant
* Date
* Time
* Tags
* Notes
* Receipt
* Location
* Tax
* Tip
* Recurring

Default Categories:

* Food & Water
* Housing
* Transportation
* Internet
* Entertainment
* Emergency
* Personal Care
* Household
* Health
* Shopping
* Education
* Subscription
* Travel
* Investment
* Other

Allow unlimited custom categories.

---

# Transfer Module

Fields:

* From Account
* To Account
* Amount
* Date
* Note

Update balances atomically.

Do not create duplicate records.

---

# Quick Add

Users should be able to quickly create:

Expense

Income

Transfer

Quick Add should open from:

* Dashboard
* Navbar
* Keyboard Shortcut

---

# Keyboard Shortcut

Ctrl + K

Command Palette should support:

* Add Expense
* Add Income
* Add Transfer
* Search Transactions
* Go to Dashboard
* Go to Reports
* Go to Analytics
* Open Settings

---

# Transaction List

Display:

Icon

Title

Category

Merchant

Account

Payment Method

Date

Amount

Type

Tags

Attachment Indicator

Status

Actions

---

# Transaction Detail Page

Show:

Complete Information

Receipt Preview

Category

Account

Payment Method

Created Date

Updated Date

Recurring Status

Linked Goal (future)

AI Insights (future)

---

# Search

Instant global search.

Search by:

Title

Merchant

Category

Tag

Note

Amount

Date

Account

Payment Method

Search results update while typing.

---

# Filters

Support:

Date Range

Today

Yesterday

This Week

This Month

Last Month

This Year

Custom Range

Category

Account

Payment Method

Tags

Amount Range

Income

Expense

Transfer

Has Attachment

Recurring

---

# Sorting

Newest

Oldest

Highest Amount

Lowest Amount

Alphabetical

Category

Merchant

---

# Bulk Actions

Allow selecting multiple transactions.

Actions:

Delete

Change Category

Change Tags

Export

Move Account

Archive

---

# Split Transactions

Support splitting one expense into multiple categories.

Example:

Restaurant

Total

Rp500.000

Split:

Food

Rp350.000

Entertainment

Rp150.000

Budget calculations must reflect the split correctly.

---

# Attachments

Support:

Image

PDF

Receipt

Invoice

Multiple attachments per transaction.

Display thumbnail preview.

---

# Merchant Management

Track merchant information.

Examples:

McDonald's

Tokopedia

Shopee

Starbucks

Pertamina

Allow searching by merchant.

Future analytics should use merchant data.

---

# Tags

Allow multiple tags.

Examples:

#Business

#Family

#Travel

#School

#Vacation

#Gym

#Investment

Display tags as chips.

---

# Notes

Support long-form notes.

Markdown support preferred.

Auto-save after short delay.

---

# Recurring Transactions

Support:

Daily

Weekly

Monthly

Yearly

Users can:

Pause

Resume

Skip Next

Delete Future Occurrences

---

# Duplicate Detection

Warn users when a very similar transaction exists.

Compare:

Amount

Date

Merchant

Title

Suggest:

"This transaction may already exist."

---

# Receipt Scanner (Future Ready)

Design architecture for future OCR support.

Potential workflow:

Upload Receipt

↓

OCR

↓

Extract:

Merchant

Amount

Date

Category Suggestion

Allow manual edits before saving.

---

# Transaction Timeline

Provide chronological timeline view.

Group by:

Today

Yesterday

This Week

Earlier

Show daily totals.

---

# Undo Support

After delete:

Display toast:

Transaction deleted.

Undo

Available for 10 seconds.

---

# Import

Support importing:

CSV

Excel

Map imported columns before saving.

Validate data before import.

---

# Export

Support exporting:

CSV

Excel

PDF

JSON

Respect current filters.

---

# Transaction Validation

Validate:

Positive Amount

Required Category

Valid Date

Valid Account

Valid Payment Method

Attachment Size

Prevent invalid submissions.

---

# Empty States

No Transactions

Display illustration.

Primary Action:

Create First Transaction

---

# Loading States

Skeleton List

Skeleton Detail

Skeleton Form

Avoid blocking the UI.

---

# Accessibility

Keyboard Navigation

ARIA Labels

Visible Focus

Accessible Tables

Accessible Dialogs

---

# Performance

Virtualize long transaction lists.

Debounce search.

Memoize expensive filters.

Lazy-load attachments.

Paginate server-side when necessary.

---

# Analytics Integration

Every transaction should automatically update:

Dashboard

Budget

Reports

Analytics

Goals

Forecast

Financial Health

Without requiring page refresh.

---

# Deliverables for Part 6

By the end of this phase:

* Income Module
* Expense Module
* Transfer Module
* Quick Add
* Transaction Timeline
* Transaction Detail
* Search
* Advanced Filters
* Sorting
* Bulk Actions
* Split Transactions
* Attachments
* Merchant Tracking
* Tags
* Recurring Transactions
* Import & Export
* Undo Delete
* Responsive UI
* Production-ready transaction management system

The transaction system should be powerful enough to support both casual users and power users while remaining simple and enjoyable to use.

End of Part 6.
