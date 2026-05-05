# kassaku-calculator
An interactive **Angular** calculator that helps customers configure their POS system, compares renting vs buying, generates a break-even analysis, and captures leads via email. Generation of PDF and e-mails in next release.

## What I learned until now from this app:
* https://dashboard.emailjs.com - automatic E-mails return
* Work with multiple languages.
* Add my own icons (svg, jpg).
* Multi step wizard.
* Events between components.
* Chart integration.
* Real time graphs.
* Calculations in Angular.
* Resize buttons, window.
* Export Angular project. ng build --configuration production --optimization=true
* Add website with ftp.
* Embed Angular inside Wordpress website (www.kassaku.nl)
* Work with types.
* Call functions from html code.
* Work with assets.
* Let AI create 90% of the code.
* More CSS styling.
  
# Functional Requirements

## FR1: Business Type Selection (First Question)

User Story: As a customer, I want to select my business type so the calculator can suggest relevant configurations.

Requirements:

    Present 4 options as clickable cards:

        🍽️ WOK (Fast casual, high table turnover)

        🍔 Restaurant (Full service, multiple courses)

        📦 Takeaway (Pickup only, no dine-in)

        🛵 Delivery (No physical location)

    Each selection affects default hardware recommendations

    Store selection throughout session

    Visual feedback on selection (highlight/border)

Acceptance Criteria:

    Only one option selectable at a time

    Cannot proceed without selection

    Different business types show different default printer counts

## FR2: Competition Price Input

User Story: As a customer, I want to enter my competitor's POS quote so I can compare fairly.

Requirements:

    Number input field: "What price did other POS providers quote you?"

    Default value: €3000

    Currency: Euro (€)

    Minimum: €0

    Maximum: €10000

    Helper text: "Include hardware, software, and installation"

Acceptance Criteria:

    Accepts decimal values (e.g., €2950.50)

    Shows formatted currency as user types

    Validation: Must be a positive number

## FR3: Usage Duration (Slider + Number)

User Story: As a customer, I want to specify how long I'll use the POS system to see long-term costs.

Requirements:

    Label: "How many months will you use this POS system?"

    Range: 12 to 120 months

    Default: 60 months (5 years - typical business horizon)

    Dual input method:

        Slider with visual tick marks at 12, 24, 36, 48, 60, 72, 84, 96, 108, 120

        Number field for precise entry

    Both inputs stay synchronized

Acceptance Criteria:

    Default shows 60 months

    Real-time updates to all calculations

    Shows year equivalent (e.g., "60 months = 5 years")

FR4: Hardware Extras Configuration

User Story: As a customer, I want to add optional hardware so I get an accurate total price.

Requirements Section: "Optional Extras (additional costs)"
Extra Item	Default Quantity	Price per Unit	Max Quantity
Second Printer	0	€150	2
Money Drawer	0	€120	1
Customer Display	0	€180	1
Digital License Keys	3	€25	10

Behavior:

    Digital keys: First 3 are free, €25 each beyond that

    Show running subtotal of extras

    Update total cost in real-time

    "+" and "-" buttons for each item

Acceptance Criteria:

    Cannot go below 0 for any item

    Digital keys show "3 included free"

    Extras cost adds to both buy AND rent calculations

## FR5: PC Hardware Options (3 Types)

User Story: As a customer, I want to choose between different PC tiers based on my budget.

Requirements: Radio button selection with 3 options:

Option 1 - Economy (€499) 🖥️

    Fanless Celeron J4125

    4GB RAM, 64GB SSD

    Windows 11 Pro

    Best for: Takeaway, Food truck, Small cafe

Option 2 - Professional (€899) 💼

    Fanless Core i5

    8GB RAM, 128GB SSD

    Windows 11 Pro

    Best for: Restaurant, Fast casual, Bakery

Option 3 - Bring Your Own PC (€0) 💻

    Customer provides own hardware

    Minimum requirements: Windows 10 Pro, 4GB RAM, 50GB free space

    No hardware warranty from Kassaku

    Software-only rental available

Acceptance Criteria:

    Price updates immediately on selection

    BYO option disables hardware warranty in advantages

    Tooltips explaining each option

## FR6: Screen/Monitor Selection

User Story: As a customer, I want to choose screen size for my kitchen/bar displays.

Requirements: Dropdown or card selection:
Screen Size	Price (if buying)	Price (rental add-on/month)
10" Customer Display	€199	€8/month
15" Standard	€249	€10/month
15" Widescreen	€299	€12/month
17" Large	€349	€14/month
No screen needed	€0	€0

Special logic:

    Kitchen display recommended for WOK/Restaurant

    Customer display recommended for Takeaway

    Minimum 1 screen for POS (main screen) - assumed included in PC price

Acceptance Criteria:

    Shows recommendation badge based on business type

    Multi-select allowed (e.g., kitchen + customer display)

    Quantity selector for each screen type

## FR7: Customer Email Capture

User Story: As a customer, I want to receive my quote and analysis via email.

Requirements:

    Email input field (required)

    Double email confirmation field

    Newsletter opt-in checkbox (pre-checked)

    GDPR compliance notice

Validation:

    Valid email format (regex)

    Both emails match

    Real-time validation with error messages

Acceptance Criteria:

    Cannot submit without valid email

    Shows "We'll never share your email" message

    Stores email in session for retargeting

## FR8: Quote Generation & Email Send

User Story: As a customer, I want to receive my personalized quote with all details.

Requirements:

    Submit button: "🔍 Get my personalized analysis →"

    On click:

        Generate unique quote ID (e.g., KSK-20250101-001)

        Save all selections to local storage

        Send email to customer

        Send BCC/notification to Kassaku sales team

        Show success message with download PDF option

Email content (to customer):

    All configuration choices

    Total cost comparison (buy vs rent)

    Break-even graph (inline image or link)

    Advantages summary

    Sales team contact info

    Call to action: "Schedule a demo"

Email content (to Kassaku):

    Same plus customer email, phone (optional), IP address

    Timestamp

    Lead score (based on budget and urgency)

Acceptance Criteria:

    Email sends within 2 seconds

    Fallback if email fails (download PDF option)

    Rate limiting (max 5 submissions per IP per hour)

## FR9: Break-Even Graph Visualization

User Story: As a customer, I want to visually see when buying becomes cheaper than renting.

Requirements:

    Line chart with two lines:

        Red line: Buy total (competition price + extras)

        Blue line: Rent from Kassaku (monthly fee × months + down payment + extras monthly)

    X-axis: Months (0 to customer's selected duration + 24 months buffer)

    Y-axis: Total cost in Euros

    Break-even point marked with vertical line and annotation

    Hover tooltips showing exact costs

Calculation logic:
text

Buy Total = competitionPrice + sum(extras)
Rent Total = rentalDownPayment + (softwareMonthy × months) + sum(extrasMonthly × months)

Where:
- rentalDownPayment = €300 (base) + (PC price if not BYO)
- softwareMonthly = €38 (base) + (screen monthly costs)
- hardwareMonthly = 0 or price*1,2/months 
- extrasMonthly = optional hardware rental fee (€0 for first 3 keys, €25/key/month for extras)

Acceptance Criteria:

    Graph updates in real-time

    Clear visual distinction before/after break-even

    Animated transitions

    Responsive sizing
    
FR10: Advantages Summary (Final Screen)

User Story: As a customer, I want to see why renting is better for my specific situation.

Requirements: Show dynamic advantages based on user selections:

Always show:

    Lower upfront cost (show exact savings)

    Free maintenance & support (€500/year value)

    Automatic software updates

    Tax deductible (consult your accountant)

Conditional advantages:

    If BYO PC: "Use your existing hardware investment"

    If extras selected: "All peripherals covered under warranty"

    If restaurant: "Kitchen display system included"

    If delivery: "Delivery routing integration ready"

    If months < 71: "You'll save €X by renting"

Disadvantages (honest but framing):

    "Higher total cost after 71 months"

    "Monthly administrative expense"

Acceptance Criteria:

    Personalized to selections

    Shows monetary savings

    Comparison table vs competition

## FR11: Multi-step Form Wizard

User Story: As a customer, I want to complete the calculator step-by-step without feeling overwhelmed.

Requirements: 4-step wizard with progress indicator:
Step	Title	Fields
1	Business Info	Business type, Competition price
2	Hardware Setup	PC type, Screens, Extras
3	Duration & Email	Usage months, Email
4	Results & Quote	Graph, Advantages, Submit

Navigation:

    Previous/Next buttons

    Step indicators (1 of 4)

    Save progress (auto-save to localStorage)

    Return later link (email reminder)

Acceptance Criteria:

    Can go back and edit previous steps

    Progress saved if page refreshed

    Step 4 shows summary of all selections

# Non-Functional Requirements
## NFR1: Performance

    First load < 2 seconds (Angular lazy loading)

    Chart renders < 500ms

    Email sends asynchronously (no blocking UI)

## NFR2: Browser Support

    Chrome/Firefox/Safari/Edge (last 2 versions)

    Mobile responsive (320px to 1920px)

## NFR3: Security

    Email API calls authenticated

    Rate limiting (anti-spam)

    No storing of sensitive data

## NFR4: Analytics

    Track step completion rates

    Track conversion (email submit)

    Track most common configurations   
    
# Possible file layout
kassaku-calculator/
├── src/
│   ├── app/
│   │   ├── break-even-calculator/
│   │   │   ├── break-even-calculator.component.ts
│   │   │   ├── break-even-calculator.component.html
│   │   │   ├── break-even-calculator.component.css
│   │   │   └── break-even-calculator.component.spec.ts
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.component.css
│   │   └── app.module.ts
│   ├── assets/
│   │   └── .gitkeep
│   ├── index.html
│   └── styles.css
├── angular.json
├── package.json
├── README.md
├── .gitignore
└── LICENSE
