You are a senior healthcare software architect and senior fullstack engineer.

Design and build a **full enterprise-level Hospital Management System (HMS) frontend** using **React.js (Vite) and Tailwind CSS**. The system must follow the architecture used by large hospital platforms such as Epic and Oracle Healt h.

The system must support a **tier-3 hospital environment** and integrate with a **Node.js + MongoDB backend**.

The frontend must be modular, scalable, and capable of supporting **80+ hospital pages**.

---

SYSTEM REQUIREMENTS

Create a **complete HMS UI layout** with the following structure:

Main Layout

* Left Sidebar Navigation (modules)
* Top Navigation Bar (search, notifications, user)
* Main Workspace Area
* Bottom Status Bar (hospital operational info)

The layout must support real-time updates and dashboards.

---

CORE HMS MODULES

1. Hospital Command Center
   Create dashboards for:

* Real-time hospital operations
* Bed occupancy
* Emergency department load
* Surgery board
* Queue monitoring
* Revenue overview

Widgets:

* Patients today
* Available beds
* Surgeries scheduled
* Waiting queue
* Emergency cases

---

2. Patient Management

Pages:

* Patient registration
* Patient search
* Patient profile
* Patient documents
* Patient insurance
* Patient alerts

Features:

* Auto-generated patient ID
* Search with pagination
* Patient status indicators

---

3. Central EMR (Electronic Medical Record)

Pages:

* Patient clinical timeline
* Clinical notes
* Diagnoses (ICD integration)
* Medication orders
* Vital signs
* Allergies
* Care plans

The EMR must act as the **central hub of patient data**.

---

4. Admission and Bed Management

Pages:

* Admission desk
* Bed allocation dashboard
* Ward view
* Bed transfers
* Discharge management

Features:

* Automatic bed allocation
* Bed availability visualization
* Ward occupancy monitoring

---

5. Queue Management System

Pages:

* OPD queue
* Laboratory queue
* Radiology queue
* Pharmacy queue
* Smart queue dashboard

Features:

* Priority scoring
* Real-time queue updates
* Waiting time tracking

---

6. Doctor Scheduling

Pages:

* Doctor roster
* Shift scheduling
* On-call scheduling
* Department staff view

Features:

* Calendar interface
* Department filters
* Doctor availability tracking

---

7. Operating Theatre (Surgery Module)

Pages:

* Surgery scheduler
* Theatre availability board
* Surgery preparation
* Intra-operative monitoring
* Surgery outcomes

Features:

* Time-slot scheduling
* Theatre locking
* Surgeon availability
* Equipment allocation

---

8. Laboratory Module

Pages:

* Lab orders
* Sample collection
* Sample tracking
* Lab processing
* Lab results
* Lab approval

Features:

* Barcode tracking
* Result immutability
* Result approval workflow
* PDF report generation

---

9. Radiology Module

Pages:

* Imaging orders
* Radiology queue
* Scan viewer
* Radiology reports
* Imaging archive

---

10. Pharmacy Module

Pages:

* Prescription orders
* Dispensing
* Drug interaction alerts
* Controlled drugs register
* Pharmacy inventory
* Expiry monitoring

Features:

* Drug safety checks
* Inventory integration

---

11. Billing and Revenue Cycle

Pages:

* Patient billing
* Invoice generation
* Payment processing
* Refund management
* Billing adjustments
* Shift reconciliation

Payment methods:

* Cash
* EFT
* Cheque
* M-Pesa

---

12. Insurance Claims

Pages:

* Insurance verification
* Claim creation
* Claim validation
* Claim dispatch
* Claim tracking
* Remittance reconciliation

Claim lifecycle:
Pending → Submitted → Dispatched → Awaiting Payment → Paid → Partially Paid → Write-off

---

13. Inventory and Stores

Pages:

* Inventory dashboard
* Item master
* Stock movement
* Batch tracking
* Expiry alerts
* Reorder management

---

14. Procurement

Pages:

* Procurement requests
* Vendor management
* Vendor performance scoring
* Purchase orders
* Goods receipt (GRN)

Workflow:
Request → Approval → Purchase Order → Delivery → GRN

---

15. Finance and Accounting

Pages:

* General ledger
* Accounts payable
* Accounts receivable
* Financial period closing
* Revenue analytics

---

16. HR and Payroll

Pages:

* Staff directory
* Payroll processing
* Leave management
* Performance management

---

17. Population Health and Analytics

Pages:

* Disease trends dashboard
* Population risk dashboard
* Hospital performance KPIs
* Ministry of Health reporting

---

TECHNOLOGY REQUIREMENTS

Frontend:

* React.js with Vite
* Tailwind CSS
* React Router
* Axios
* Socket.io for real-time updates

Backend integration:

* Node.js
* Express
* MongoDB

---

UI COMPONENTS

Create reusable components for:

* Data tables
* Dashboard cards
* Modals
* Forms
* Charts
* Status badges
* Tabs
* Notification alerts

---

REAL-TIME FEATURES

The UI must support live updates for:

* Bed availability
* Queue changes
* Surgery status
* Lab results
* Emergency alerts

---

DESIGN GOALS

* Clean enterprise hospital interface
* Modular architecture
* Scalable to 80+ pages
* Role-based access ready
* Multi-branch support
* Real-time operational dashboards

---

The output should include:

* Project folder structure
* Layout components
* Example module pages
* Reusable UI components
* Routing structure
* Dashboard examples
