# Finance Tracker SaaS

## Part 3 — Database Architecture & Prisma Specification

# Objective

Design a scalable relational database capable of supporting:

* Personal Finance
* Future Multi-user Support
* Analytics
* AI Insights
* Forecasting
* Budget Management
* Financial Goals
* Attachments
* Tags
* Import / Export
* Recurring Transactions

The database must be optimized for maintainability and future growth.

---

# Database

Use

PostgreSQL

ORM

Prisma

Use UUID as the primary key for every table.

Enable created_at and updated_at timestamps on every entity.

Use soft delete where appropriate.

---

# Core Principles

Normalize the database.

Avoid duplicated data.

Use foreign keys.

Maintain referential integrity.

Design for future expansion.

---

# Main Entities

The application should include the following models.

## User

Purpose

Application owner.

Fields

* id
* name
* email
* password_hash
* avatar_url
* currency
* locale
* timezone
* theme
* created_at
* updated_at

Relationships

User owns:

Accounts

Categories

Budgets

Income

Expenses

Transactions

Goals

Tags

Subscriptions

Settings

Attachments

---

## Account

Represents where money is stored.

Examples

Cash

BCA

Mandiri

Jago

SeaBank

OVO

GoPay

Credit Card

Investment

Fields

* id
* user_id
* name
* account_type
* current_balance
* color
* icon
* is_default
* created_at
* updated_at

---

## Category

Used by both income and expense.

Default expense categories

Food & Water

Housing

Transportation

Internet

Entertainment

Emergency

Personal Care

Household

Health

Shopping

Education

Subscription

Travel

Investment

Others

Default income categories

Salary

Business

Investment

Bonus

Freelance

Gift

Others

Fields

* id
* user_id
* name
* type (Income / Expense)
* color
* icon
* archived
* created_at
* updated_at

---

## Budget

Each expense category has one monthly budget.

Fields

* id
* user_id
* category_id
* amount
* month
* year
* rollover_enabled
* created_at
* updated_at

---

## Transaction

Master transaction table.

Every financial movement should exist here.

Fields

* id
* user_id
* account_id
* category_id
* transaction_type
* amount
* date
* title
* note
* recurring_transaction_id
* created_at
* updated_at

---

## Expense

Expense-specific metadata.

Fields

* id
* transaction_id
* payment_method
* merchant
* receipt_attachment
* location
* tax_amount

---

## Income

Income-specific metadata.

Fields

* id
* transaction_id
* income_source

---

## Payment Method

Examples

Cash

Debit Card

Credit Card

QRIS

Bank Transfer

GoPay

OVO

DANA

ShopeePay

Fields

* id
* user_id
* name
* icon
* color

---

## Goal

Examples

Emergency Fund

Laptop

Vacation

House

Wedding

Car

Fields

* id
* user_id
* title
* description
* target_amount
* current_amount
* target_date
* status
* created_at
* updated_at

---

## Subscription

Examples

Netflix

Spotify

ChatGPT

Claude

Gym

YouTube Premium

Fields

* id
* user_id
* name
* amount
* billing_cycle
* renewal_date
* account_id
* category_id

---

## Recurring Transaction

Fields

* id
* user_id
* title
* amount
* frequency
* start_date
* end_date
* next_run
* active

Supports

Daily

Weekly

Monthly

Yearly

---

## Tag

Examples

Gym

Business

Vacation

School

Family

Investment

Fields

* id
* user_id
* name
* color

Many-to-many relationship with transactions.

---

## Attachment

Fields

* id
* transaction_id
* file_name
* file_url
* mime_type
* file_size
* uploaded_at

Supports

Images

PDF

Receipts

Invoices

---

## Settings

Fields

* id
* user_id
* currency
* language
* theme
* notifications_enabled
* weekly_report
* monthly_report

---

# Relationships

User

↓

Accounts

↓

Transactions

↓

Income / Expense

↓

Categories

↓

Budgets

Goals

Subscriptions

Tags

Attachments

Payment Methods

Settings

Every relationship should use foreign keys with cascading updates where appropriate.

Avoid cascading deletes on financial records.

---

# Indexing Strategy

Create indexes on:

user_id

category_id

account_id

transaction_date

transaction_type

month

year

goal_status

subscription_renewal_date

recurring_next_run

Use composite indexes for:

(user_id, date)

(user_id, category_id)

(user_id, month, year)

to improve dashboard performance.

---

# Constraints

Amounts must never be negative unless explicitly representing refunds.

Budgets must be unique per:

User

Category

Month

Year

Emails must be unique.

Account names must be unique per user.

---

# Future Scalability

Design the schema to support:

Shared wallets

Family budgeting

Business accounts

Multi-currency

Exchange rates

AI-generated insights

Bank integrations

Open Banking APIs

Audit logs

Role-based permissions

without major schema redesign.

---

# Data Integrity

Always use database transactions for:

Transfer between accounts

Recurring transaction generation

Budget updates

Bulk imports

Ensure atomicity.

---

# Prisma Standards

Use descriptive model names.

Use enums where appropriate.

Use relation fields.

Use Prisma migrations.

Seed default categories and payment methods during initialization.

---

# Seed Data

Create seed scripts for:

Default Income Categories

Default Expense Categories

Default Payment Methods

Sample Dashboard Data

Sample Budget Data

Sample Accounts

This should allow developers to immediately explore the application after setup.

---

# Deliverables for Part 3

By the end of this phase:

* Complete Prisma schema designed.
* Database relationships finalized.
* Index strategy documented.
* Seed strategy documented.
* Ready for Authentication implementation.
* Prepared for Dashboard and Analytics queries.

The database should be production-ready and capable of supporting future enterprise features without significant redesign.

End of Part 3.
