# 🌾 RuralFund – Cloud-Based Microlending Platform (Offline-First)

##  Project Summary

**RuralFund** is a cloud-native microlending platform designed for rural borrowers who face unstable internet access.

The platform uses an **offline-first Progressive Web App (PWA)** that works without internet, securely stores loan data on the device, and syncs with **AWS cloud services** once connectivity is restored.

This ensures villagers can reliably request loans, view repayment schedules, and update transactions, while lenders can review, approve, and track loans seamlessly.

---

##  Core Components

**1. Frontend (PWA)**

* Built with React (or Vue/Angular)
* Offline storage with **IndexedDB** (via Dexie.js)
* **Service Workers** + Workbox for caching & background sync

**2. Backend (AWS)**

* **DynamoDB** → Loan requests, repayments, user data
* **AWS Lambda** → Handles sync, loan logic, approvals
* **API Gateway** → REST/GraphQL APIs for borrowers & lenders
* **S3 + CloudFront** → Hosting the PWA

**3. Authentication & Security**

* **AWS Cognito** → Secure login for borrowers & lenders

**4. Notifications**

* **Amazon SES** → Push notifications (loan approvals, reminders)

**5. Dev Tools & Collaboration**

* GitHub (version control), Postman (API testing)

---

##  Workflows

### 👩‍🌾 Borrower Workflow

**Offline:**

1. Open RuralFund PWA on phone (works offline)
2. Fill out loan request form (amount, purpose, repayment schedule)
3. Data is stored securely in IndexedDB until internet is available

**Sync (When Internet Returns):**
4. Background Sync sends data to **AWS API Gateway → Lambda → DynamoDB**
5. Borrower receives confirmation via **push notification(SES)**
6. Borrower can check loan status & repayment schedule (synced dashboard)

---

###  Lender Workflow

**Online:**

1. Log into RuralFund Lender Dashboard (web/mobile)
2. See borrower requests from DynamoDB
3. Approve or reject loan

---

###  Backend Workflow (Sync & Conflict Resolution)

1. Borrower submits/updates loan data offline
2. On reconnect, PWA sends pending transactions to **Sync API (AWS Lambda)**
3. Conflict resolution rules apply:

   * Latest update wins **OR**
   * Priority rule (e.g., lender’s decision overrides borrower changes)
4. **DynamoDB** updates records
5. Triggers **SES notification** → borrower/lender sees update

---

##  Tech Stack

* **Frontend:** React, HTML, CSS, JS, Dexie.js
* **Backend:** AWS Lambda, API Gateway, DynamoDB
* **Hosting:** S3 + CloudFront
* **Authentication:** AWS Cognito
* **Notifications:** Amazon SES
* **Version Control & Dev Tools:** GitHub, Postman

---





