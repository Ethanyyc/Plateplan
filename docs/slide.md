# Slide 1 - Title
- PlatePlan
- 
# Slide 2 - Introduction
- Team 32 developed PlatePlan, a full-stack web application that helps home cooks organize recipes and plan balanced weekly meals efficiently. The system supports authenticated users who can create and edit recipes, upload cover photos, and assign meals to breakfast, lunch, and dinner slots in a weekly planner. PlatePlan is built using React + TypeScript on the frontend, Express + TypeScript on the backend, and PostgreSQL with Prisma for persistent relational data, with DigitalOcean cloud storage for images and OpenAI-powered nutrition insights. Our goal is to simplify everyday meal planning with actionable dietary guidance.

# Slide 3 - Problem and Users
- Problem: Existing tools do not connect recipe organization, weekly planning, and actionable diet feedback in one workflow.
- Target users:
- Students managing meal prep on a budget
- Busy home cooks
- Families planning a balanced weekly schedule

# Slide 4 - App Features Overview
- Personal recipe library:
- Create, edit, delete, search, and organize recipes
- Ingredient lists, instructions, tags, and folder organization
- Weekly meal planner:
- Assign recipes to breakfast/lunch/dinner across 7 days
- Drag-and-drop update and quick entry management
- AI nutrition support:
- Recipe-level nutrition analysis and suggestions
- Weekly meal-plan diet recommendations
- Secure and personalized experience:
- User login/session auth and user-scoped data access

# Slide 5 - Core Technical Requirements
- Architecture Approach: Separate Frontend & Backend
- Frontend:
- TypeScript for frontend code, React for UI
- Tailwind CSS + shadcn/ui for styling and components
- Responsive layout across desktop/mobile views
- Backend:
- TypeScript for backend code
- Express.js server with RESTful API routes
- PostgreSQL for relational persistence (via Prisma ORM)
- Cloud storage for file handling (DigitalOcean Spaces)

# Slide 6 - Advanced Features
- Advanced feature 1: User authentication and authorization
- Implemented with Better Auth for session-based login and protected user data access
- Better Auth manages sign-up, sign-in, sign-out, and session cookies
- Backend middleware checks session on protected API routes and resolves current user
- Access control ensures each user only sees and edits their own content
- Advanced feature 2: Integration with external cloud AI service
- Implemented with OpenAI API for nutrition insights on individual recipes and weekly meal plans
- Backend sends recipe ingredients or weekly meal-plan summaries to OpenAI API
- AI returns structured JSON outputs that are rendered in nutrition/suggestion panels
- Results are integrated directly into the user workflow for decision support

# Slide 7 - Closing
- Thank you
