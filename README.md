# Notes App — Frontend

A modern notes application frontend built with **Next.js (App Router)**, **React**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, and **Supabase Auth**.  
The app provides authenticated note management with favorites, CRUD operations, and a responsive UI.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** TailwindCSS + shadcn/ui
- **State/Data:** React Query + local UI state
- **Auth:** Supabase Authentication (JWT)
- **API:** REST backend (`/api/v1`)

---

## ✨ Features

- Supabase email/password authentication
- Protected routes (redirect if not logged in)
- Create, edit, delete notes
- Mark notes as favorite
- Optimistic UI updates
- Responsive layout shell
- Type-safe API layer

---

## 📂 Folder Structure

```text
app/
  layout.tsx
  page.tsx
  auth/
    login/page.tsx
    signup/page.tsx

components/
  layout-shell.tsx
  notes-list.tsx
  editor.tsx
  auth/
    AuthLayout.tsx

hooks/
  use-auth.ts
  use-notes.ts
  use-debounce.ts

lib/
  supabase-client.ts
  query-client.ts
  utils.ts

store/
  notes-slice.ts
  index.ts

shared/
  routes.ts
  schema.ts

types/
  note.ts
```

---

## 🔐 Authentication Flow

1. User signs up / logs in via Supabase  
2. Supabase returns access token (JWT)  
3. Token stored in Supabase session  
4. `useAuth()` exposes session  
5. Protected pages check session  

- ❌ no session → redirect `/auth/login`  
- ✅ session → render app  

---

## 📡 API Integration

Backend base URL:

```text
http://localhost:8000/api/v1
```

Endpoints used:

```http
GET    /notes
POST   /notes
PUT    /notes/:id
DELETE /notes/:id
```

All requests include:

```http
Authorization: Bearer <supabase_access_token>
```

---

## ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧩 Core Hooks

### useAuth

- Get session
- Login / signup
- Logout
- Redirect protection

### useNotes

- Fetch notes (React Query)
- Create / update / delete
- Cache invalidation
- Favorite toggle

---

## 🎨 UI Architecture

- **layout-shell** → main app layout (sidebar + content)
- **notes-list** → sidebar list + favorite toggle
- **editor** → note editor
- **AuthLayout** → auth pages wrapper

---

## ▶️ Getting Started

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔒 Route Protection

Protected pages use auth guard:

```ts
const { user, loading } = useAuth();

if (!loading && !user) {
  router.replace("/auth/login");
  return null;
}
```

---

## 🧱 Type Safety

Shared note type:

```ts
export interface Note {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
}
```

Used across:

- API layer
- React state
- UI components

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 📝 Future Improvements

- Offline sync
- Rich text editor
- Tags & search
- Drag reorder
- Collaborative notes

---

## 👤 Author

Frontend architecture and implementation by **Sourav**
