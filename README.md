# Portfolio Website - Dental Clinic

A modern, responsive portfolio website for a dental clinic with Supabase integration for authentication and booking management.

## 🌟 Features

- **Beautiful Landing Page** - Modern UI with smooth animations
- **User Authentication** - Signup/Login with Supabase
- **Admin Dashboard** - Manage bookings and metrics (admin-only access)
- **Booking System** - Customers can submit booking requests
- **Status Management** - Toggle booking status (Pending/Confirmed)
- **Responsive Design** - Works on all devices

## 📁 Project Structure

```
portfolio-1/
├── components/          # React components
│   ├── AuthForm.tsx    # Login/Signup form
│   ├── Booking.tsx     # Booking form component
│   ├── Navbar.tsx      # Navigation bar
│   ├── Hero.tsx        # Hero section
│   ├── Services.tsx    # Services section
│   ├── Team.tsx        # Team section
│   └── ...             # Other components
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   └── Dashboard.tsx   # Admin dashboard
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── supabase/
│   └── migrations/     # Database migrations
├── public/             # Static files
│   └── _redirects      # Netlify routing config
├── .env                # Environment variables (DO NOT COMMIT)
├── netlify.toml        # Netlify configuration
├── package.json        # Dependencies
└── vite.config.ts      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository** (after pushing to GitHub)
   ```bash
   git clone <your-repo-url>
   cd portfolio-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🗄️ Database Setup

### Supabase Tables

#### 1. `profiles` Table
Stores user profile information and admin status.

```sql
- id (uuid, primary key)
- full_name (text)
- website_url (text)
- goal (text)
- income (text)
- clients_count (integer)
- is_admin (boolean)
```

#### 2. `bookings` Table
Stores customer booking requests.

```sql
- id (uuid, primary key)
- created_at (timestamp)
- name (text)
- phone (text)
- treatment (text)
- preferred_date (date)
- message (text)
- status (text) - 'pending' or 'confirmed'
- user_id (uuid, optional)
```

### Setting Up Admin Access

To make a user an admin, run this SQL in Supabase:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id';
```

## 📱 Pages

### Homepage (`/`)
- Hero section
- Services showcase
- Team introduction
- Booking form
- Reviews and testimonials

### Login Page (`/login`)
- User authentication
- Signup/Signin toggle
- Auto-redirect to dashboard after login

### Dashboard (`/dashboard`) - Admin Only
- View and edit profile metrics (Goal, Income, Clients)
- View all booking requests
- Change booking status (Pending ↔ Confirmed)

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Admin-only dashboard** - Regular users cannot access
- **Environment variables** - Sensitive data not committed to Git
- **.gitignore** - Excludes `.env`, `node_modules`, `dist`

## 🎨 Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router
- **Deployment**: Netlify

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for automatic deployments

3. **Configure environment variables** in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🔧 Configuration Files

### `netlify.toml`
Handles SPA routing for Netlify deployment.

### `_redirects`
Fallback routing for single-page application.

### `.gitignore`
Excludes sensitive files and build artifacts from Git.

## 📚 Key Features Explained

### Booking System
1. Customer fills out form on homepage
2. Data saved to Supabase `bookings` table
3. Admin views bookings in dashboard
4. Admin can change status by clicking the badge

### Admin System
- Only users with `is_admin = true` can access dashboard
- Regular users redirected to homepage
- First user automatically becomes admin

### Authentication Flow
1. User signs up with email/password
2. Profile automatically created in `profiles` table
3. User can log in and access dashboard (if admin)

## 🐛 Troubleshooting

### "Access Denied" on Dashboard
- Make sure your user has `is_admin = true` in the `profiles` table

### Booking form not saving
- Check Supabase connection in browser console
- Verify RLS policies allow public inserts on `bookings` table

### 404 errors on deployed site
- Ensure `_redirects` file is in the `dist` folder
- Check `netlify.toml` configuration

## 📞 Support

For issues or questions, please check:
- Supabase Dashboard: https://supabase.com/dashboard
- Project URL: https://tpzdercbacefqfpadhcb.supabase.co

## 📄 License

This project is private and for personal use.

---

**Built with ❤️ using React, Supabase, and Vite**
