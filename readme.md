<div align="center">

# 👔 ${\textsf{\color{cornflowerblue}Mind Glowing Finance}}$

Empower your small business or freelance endeavors with Mind Glowing Finance, a comprehensive CRM platform designed to streamline customer management, product cataloging, project time tracking, and invoicing. Your all-in-one solution for seamless financial management and client satisfaction.

![GitHub Repo stars](https://img.shields.io/github/stars/kenjibailly/mindglowing_finance?style=plastic&logo=github&color=blue)
![Github Forks](https://img.shields.io/github/forks/kenjibailly/mindglowing_finance?style=plastic&logo=github&color=blue)
![GitHub watchers](https://img.shields.io/github/watchers/kenjibailly/mindglowing_finance?style=plastic&logo=github&color=blue)

</div>

> [!NOTE]
> ❗🚧 The platform is currently in development and is not finished.

# 💾 ${\textsf{\color{lightgreen}Installation}}$

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

# ⭐ ${\textsf{\color{yellow}Features}}$

## ${\textsf{\color{indianred}Dashboard}}$

🚧 Currently in development, only placeholders at the moment

## 🛠️ ${\textsf{\color{indianred}Settings}}$
<details>

<summary>🛠️ Settings</summary>

### Account

- ✅ Date Format
- ✅ Time Zone
- ✅ Currency
- ✅ First Name
- ✅ Last Name
- ✅ Email
- ✅ Company Name
- ✅ Street
- ✅ Street 2
- ✅ City
- ✅ State
- ✅ Zip
- ✅ Country

### Customization

- ✅ Invoice Prefix
- ✅ Invoice Separator
- ✅ Estimate Prefix
- ✅ Estimate Separator
- ✅ Items Per Page (pagination)

### Payment Methods

Create a payment method with the following fields:

- ✅ Name
- ✅ Description

### Discounts

Create a discount with the following fields:

- ✅ Name
- ✅ Discount Code
- ✅ Discount total
- ✅ Discount Percentage
- ✅ Description

### Shipping Companies

Create a shipping company with the following fields:

- ✅ Name
- ✅ Description

### Taxes

Create a tax with the following fields:

- ✅ Name
- ✅ Percentage
- ✅ Description

</details>

## 🧑‍🤝‍🧑 ${\textsf{\color{indianred}Customers}}$

<details>

<summary>Create a customer with the following fields:</summary>
</br>

**Personal Information:**
- ✅ First Name
- ✅ Last Name
- ✅ Email
- ✅ Company
- ✅ Currency

**Shipping and Billing Information**

- ✅ Street
- ✅ Street 2
- ✅ City
- ✅ State
- ✅ Zip
- ✅ Country
- ✅ Option to save billing same as shipping

**Contact Information**

- ✅ Preferred medium of contact
    - Email
    - Discord
    - Telegram
    - Instagram
    - Twitter
    - Other 
- ✅ Contact Medium Username

</details>

<details>

<summary>⚙️ Functions</summary>

- ✅ Create
- ✅ Edit
- ✅ Delete
- ✅ Delete Selected

</details>

## 📦 ${\textsf{\color{indianred}Products}}$

<details>

<summary>Create a product with the following fields:</summary>

- ✅ Picture
- ✅ Name
- ✅ Price
- ✅ Description

</details>

<details>

<summary>⚙️ Functions</summary>

- ✅ Create
- ✅ Edit
- ✅ Delete
- ✅ Delete Selected

</details>

## 📃 ${\textsf{\color{indianred}Invoices}}$

<details>

<summary>Create an invoice with the following fields:</summary>

- ✅ Number
- ✅ Customer
- ✅ Product
- ✅ Quantity
- ✅ Option to add another product
- ✅ Add project
- ✅ Add project hour rate
- ✅ Discount
- ✅ Option to add another discount
- ✅ Tax
- ✅ Shipping Amount
- ✅ Shipping Company
- ✅ Paid On Date
- ✅ Paid Amount
- ✅ Payment Method
- ✅ Option to add another payment
- ✅ Description

</details>

<details>

<summary>⚙️ Functions</summary>

- ✅ Create
- ✅ Delete
- ✅ Delete Selected
- ❌ Edit invoice
- ❌ Create a PDF
- ❌ Send the PDF to the client using mailgun

</details>


## 📋 ${\textsf{\color{indianred}Estimates}}$

<details>

<summary>Create an estimate with the following fields:</summary>

- ❌ Number
- ❌ Customer
- ❌ Product
- ❌ Quantity
- ❌ Option to add another product
- ❌ Discount
- ❌ Option to add another discount
- ❌ Tax
- ❌ Shipping Amount
- ❌ Shipping Company
- ❌ Project time
- ❌ Project hour rate
- ❌ Description

</details>

<details>

<summary>⚙️ Functions</summary>

- ❌ Create
- ❌ Edit
- ❌ Delete
- ❌ Delete Selected
- ❌ Create a PDF
- ❌ Send the PDF to the client using mailgun

</details>

## 🗂️ ${\textsf{\color{indianred}Projects}}$

Create a project and use time tracking to bill this to the client.

<details>

<summary>Create a project with the following fields:</summary>

- ✅ Name
- ✅ Customer
- ✅ Description

</details>

<details>

<summary>⚙️ Functions</summary>

- ✅ Create
- ✅ Edit
- ✅ Delete
- ✅ Delete Selected

</details>

### ⏱️ ${\textsf{\color{orange}Time Tracking}}$

Tracks your time, create a name and start tracking your time

<details>

<summary>Create a time tracking with the following fields:</summary>

- ✅ Name
- ✅ Has start date and time
- ✅ Has stop date and time
- ❌ Custom start/stop date and time input 

</details>

<details>

<summary>⚙️ Functions</summary>

- ✅ Start
- ✅ Stop
- ✅ Delete Selected

</details>

## 🔍 ${\textsf{\color{indianred}Search}}$

<details>

<summary>Searches for the following in one search field:</summary>
</br>

**Customers**

- ✅ First Name
- ✅ Last Name
- ✅ Email

**Invoices**

- ✅ Number with prefix
- ✅ Description

**Products**

- ✅ Name
- ✅ Description

**Projects**

- ✅ Name
- ✅ Description

</details>

## 🔮 ${\textsf{\color{indianred}Plans}}$

- ❌ Create API functionality

## 👷 ${\textsf{\color{indianred}Personal Development General ToDo}}$

- ❌ Check success alerts
- ❌ CSS styling
- ❌ Change delete buttons placement inside table
- ❌ Overview pages for:
    - ✅ Customer
        - ❌ Table with links to last invoices
        - ❌ Table with links to last estimates
        - ❌ Table with links to last projects
    - ✅ Product
        - ❌ Stats of product sales
        - ❌ Table with latest invoices where product is used
    - ❌ Estimate
    - ❌ Invoice
        - ❌ Add project section
        - ❌ Update totals section
- ✅ Create Invoice
    - ✅ Add total time html element to bill project section in create invoice when project is selected
    - ✅ Push total time and hour rate to invoice creation
    - ✅ Change name to company when company exists of customer
    - ✅ Update total section with project time * hour rate
- ❌ Function to count all the time trackings of a project and add them to an invoice
    - ❌ Add one labor hour price
- ❌ Add type to search and style
- ❌ Add click menu to profile picture for logout
- ❌ Leads and their conversion