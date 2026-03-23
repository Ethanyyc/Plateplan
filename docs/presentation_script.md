# PlatePlan 6-Minute Presentation Script

## Slide 1 - Title

## Slide 2 - Introduction
"Hi everyone, we are Team 32. We built PlatePlan to make everyday meal planning simpler for home cooks, students, and families. Instead of juggling scattered notes and apps, users can keep their recipes in one place, plan a full week of meals, and get practical nutrition suggestions they can actually act on. Our goal is to reduce planning stress and help people make healthier choices with less effort."

---

## Slide 3 - Problem + Users
"Our main users are students, busy home cooks, and families. The use case is simple: users save and manage their own recipes, create a weekly meal plan, and then request AI suggestions for healthier choices. The key value is reducing planning friction while giving practical diet feedback, instead of only showing raw nutrition numbers."

---

## Slide 4 - App Features Overview
"Before going into technical requirements, here is a quick feature walkthrough of the app. First, users have a personal recipe library where they can create, edit, delete, search, and organize recipes with ingredients, tags, and folders. Second, they can build a weekly plan by assigning recipes to breakfast, lunch, and dinner slots across seven days with drag-and-drop interactions. Third, they can request AI nutrition analysis for a single recipe and AI diet suggestions for the full weekly plan."

---

## Slide 5 - Core Technical Requirements
"Now we are moving to core technical requirements. We use Option B architecture with a separate frontend and backend. The frontend is React + TypeScript with Tailwind and shadcn/ui, and the backend is an Express REST API in TypeScript. Data is stored in PostgreSQL through Prisma, and recipe images are uploaded to DigitalOcean Spaces with the URL saved in the database."

"The app is responsive using mobile-first Tailwind layouts that adapt between phone and desktop. For integration, the React client sends cookie-based requests, the backend verifies sessions and validates input, then reads and writes PostgreSQL and cloud image data, and returns structured JSON so the UI updates immediately without page reloads."

---

## Slide 6 - Advanced Features
"Separately from core requirements, we implemented two advanced features. The first is user authentication and authorization, implemented with Better Auth. Better Auth handles sign-up, sign-in, sign-out, and session cookies, and our backend checks those sessions on protected routes to identify the current user."

"The second is external AI integration through the OpenAI API. Our backend sends recipe ingredient lists or weekly meal-plan summaries to OpenAI, receives structured nutrition and recommendation outputs, and returns those results to the frontend panels. This keeps AI usage integrated into normal app workflows instead of a separate tool."

---
"Now let's move to the demo"
---

## Slide 7 - Closing
For future improvements, we want to focus on three areas. First, stronger nutrition quality: integrating a verified nutrition data source and adding confidence indicators so users can better interpret AI outputs. Second, smarter planning support: one-click weekly auto-fill, grocery list generation from selected meals, and preference-aware suggestions for budget, dietary tags, or prep time.