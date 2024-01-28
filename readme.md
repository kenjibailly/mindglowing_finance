# Mind Glowing Finance

Mind Glowing Finance is a CRM platform created for small businesses / freelancers. 
The platform is currently in development and is not finished.

# Installation

1. Clone the repository

```bash 
git clone https://github.com/kenjibailly/mindglowing_finance/
```

2. Copy example .env file and make changes:

```bash
cp .env.example .env
```



3. Run the Docker Compose

```bash
docker-compose up -d
```

# Features

## Settings

### Account

- [x] Date Format
- [x] Time Zone
- [x] Currency
- [x] First Name
- [x] Last Name
- [x] Email
- [x] Company Name
- [x] Street
- [x] Street 2
- [x] City
- [x] State
- [x] Zip
- [x] Country

### Customization

- [x] Invoice Prefix
- [x] Invoice Separator
- [x] Estimate Prefix
- [x] Estimate Separator
- [x] Items Per Page

### Payment Methods

Create a payment method with the following fields:

- [x] Name
- [x] Description

### Discounts

Create a discount with the following fields:

- [x] Name
- [x] Discount Code
- [x] Discount total
- [x] Discount Percentage
- [x] Description

### Shipping Companies

Create a shipping company with the following fields:

- [x] Name
- [x] Description

### Taxes

Create a tax with the following fields:

- [x] Name
- [x] Percentage
- [x] Description

## Customers

Create a customer with the following fields:

**Personal Information:**
- [x] First Name
- [x] Last Name
- [x] Email
- [x] Company
- [x] Currency

**Shipping and Billing Information**

- [x] Street
- [x] Street 2
- [x] City
- [x] State
- [x] Zip
- [x] Country
- [x] Option to save billing same as shipping

**Functions**

- [x] Create
- [x] Edit
- [x] Delete
- [x] Delete Selected

## Items

Create an item with the following fields:

- [x] Picture
- [x] Name
- [x] Price
- [x] Description

**Functions**

- [x] Create
- [x] Edit
- [x] Delete
- [x] Delete Selected

## Invoices

Create an invoice with the following fields:

- [x] Number
- [x] Customer
- [x] Item
- [x] Quantity
- [x] Option to add another item
- [x] Discount
- [x] Option to add another discount
- [x] Tax
- [x] Shipping Amount
- [x] Shipping Company
- [x] Paid On Date
- [x] Paid Amount
- [x] Payment Method
- [x] Option to add another payment
- [x] Description

**Functions**

- [x] Create
- [x] Delete
- [x] Delete Selected
- [ ] Edit invoice
- [ ] Create a PDF
- [ ] Send the PDF to the client using mailgun


## Estimates

- [ ] Create
- [ ] Edit
- [ ] Delete
- [ ] Delete Selected
- [ ] Create a PDF
- [ ] Send the PDF to the client using mailgun

## Projects

Create a project and use time tracking to bill this to the client.

Create a project with the following fields:

- [x] Name
- [x] Customer
- [x] Description

**Functions**

- [x] Create
- [x] Edit
- [x] Delete
- [x] Delete Selected

### Time Tracking

Tracks your time, create a name and start tracking your time

Create a time tracking with the following fields:

- [x] Name
- [x] Has start date and time
- [x] Has stop date and time
- [ ] Custom start/stop date and time input 


**Functions**

- [x] Start
- [x] Stop
- [x] Delete
- [x] Delete Selected


## Other

### Search

Searches for the following in one search field:

**Customers**

- [x] First Name
- [x] Last Name
- [x] Email

**Invoices**

- [x] Number with prefix
- [x] Description

**Items**

- [x] Name
- [x] Description

**Projects**

- [x] Name
- [x] Description


### Pagination

Change the pagination items per page in the customization settings


## Plans

- [ ] Create API functionality