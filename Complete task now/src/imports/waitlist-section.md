Add a Waitlist Counter Section to the landing page.

This section must appear below the Hero and above "How It Works".

Design style must match the dark premium fintech theme using:

Background: #000000 → #16153C gradient
Accent: #3C38BD
Secondary: #7E7AE8
Text: #EBEDEF

SECTION TITLE
Centered headline:

Our Early Access Community Is Growing.

Subtext:

Founders and investors are securing their spot.

COUNTER LAYOUT
Create two separate glass cards side‑by‑side.

Card 1:
🚀 Founders Joined
Large rolling animated number (example: 247)

Card 2:
💼 Investors Joined
Large rolling animated number (example: 1,082)

Design details:
• Glassmorphism style
• Soft glow border
• Number should use rolling count animation
• On hover → subtle lift + blue glow
• Use gradient accent for numbers (#3C38BD → #7E7AE8)

Add microtext below:

Updated in real time.

🔐 ADMIN PANEL (PRIVATE — NOT PUBLIC)
Create a separate frame titled:

StartHub Admin Panel

Access: password protected (not visible on main site)

Layout:

Minimal dark dashboard design.

Sections:

1️⃣ Total Waitlist Overview
• Total Founders
• Total Investors
• Total Combined

2️⃣ Manual Add Entry
Fields:
• Email
• Role (Founder / Investor)
• Add button

3️⃣ Data Table
Columns:
• Email
• Role
• Date Joined
• Status (Active / Removed)

4️⃣ Controls
• Export CSV button
• Delete entry
• Reset counter (admin only)

5️⃣ Login Gate
Admin login screen before dashboard:
• Email
• Password
• Secure login button

Admin page must not be linked publicly.
Access only via /admin route.

⚙️ BACKEND LOGIC (FOR DEV)
Waitlist Database Schema:

Table: waitlist

Fields:

id

email

role (founder/investor)

created_at

status

Counters:
Founder Count = count where role = founder
Investor Count = count where role = investor

Admin:
Role-based access control
Only your email has admin privileges.

🔥 IMPORTANT UX RULE
Counters must:
• Increase dynamically when new user signs up
• Be animated on page load
• Not be manually hardcoded

💡 EXTRA CONVERSION BOOST
Under counters add:

“Join before we close early access.”

This creates urgency.