# PlatePlan 6-Minute Presentation Script

## Slide 1 - Title

## Slide 2 - Introduction
"Hi everyone, we are Team 32. Team 32 developed PlatePlan, a full-stack web application that helps home cooks organize recipes and plan balanced weekly meals efficiently. The system supports authenticated users who can create and edit recipes, upload cover photos, and assign meals to breakfast, lunch, and dinner slots in a weekly planner. PlatePlan is built using React + TypeScript on the frontend, Express + TypeScript on the backend, and PostgreSQL with Prisma for persistent relational data, with DigitalOcean cloud storage for images and OpenAI-powered nutrition insights. Our goal is to simplify everyday meal planning with actionable dietary guidance."

---

## Slide 3 - Problem + Users
"Our main users are students, busy home cooks, and families. The use case is simple: users save and manage their own recipes, assign them to breakfast, lunch, and dinner slots for each day, and then request AI suggestions for healthier choices. The key value is reducing planning friction while giving practical diet feedback, instead of only showing raw nutrition numbers."

---

## Slide 4 - App Features Overview
"Before going into technical requirements, here is a quick feature walkthrough of the app. First, users have a personal recipe library where they can create, edit, delete, search, and organize recipes with ingredients, tags, and folders. Second, they can build a weekly plan by assigning recipes to breakfast, lunch, and dinner slots across seven days with drag-and-drop interactions. Third, they can request AI nutrition analysis for a recipe and AI diet suggestions for the full weekly plan."

"Do the demo side by side"

---

## Slide 5 - Core Technical Requirements
"Now we are moving to core technical requirements. Our architecture approach is Option B: separate frontend and backend. On the frontend, we use TypeScript for code, React for UI, and Tailwind CSS with shadcn/ui components, with responsive layouts for desktop and mobile. On the backend, we use TypeScript with an Express REST API. For persistence, we use PostgreSQL through Prisma. For required cloud file handling, we upload recipe images to DigitalOcean Spaces and store the returned URL with each recipe."

"For responsive design, we use mobile-first Tailwind breakpoints and flexible layouts, so key pages switch between stacked and multi-column arrangements, with adjusted spacing, typography, and navigation behavior across phone and desktop screen sizes."

"For frontend-backend interaction, the React UI sends cookie-based API requests when users create, edit, or plan meals. The Express backend verifies the session, validates input, then reads or writes data in PostgreSQL and cloud storage when needed. After that, it returns structured JSON responses, and the frontend updates local state so the UI reflects changes immediately without a page reload."

---

## Slide 6 - Advanced Features
"Separately from core requirements, we implemented two advanced features. The first is user authentication and authorization, implemented with Better Auth. Better Auth handles sign-up, sign-in, sign-out, and session cookies, and our backend checks those sessions on protected routes to identify the current user. That is how we enforce user-scoped access control across recipe, folder, and meal-plan data."

"The second is external AI integration through the OpenAI API. Our backend sends recipe ingredient lists or weekly meal-plan summaries to OpenAI, receives structured nutrition and recommendation outputs, and returns those results to the frontend panels. This keeps AI usage integrated into normal app workflows instead of a separate tool."

---

## Slide 7 - Closing