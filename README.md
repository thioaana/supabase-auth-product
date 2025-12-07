# Agro Proposals Handling

A web application for managing agricultural proposals with PDF generation and digital signature support. Built with Next.js 15, Supabase, and React 19.

## Features

- **Authentication**: Secure user authentication with Supabase (login, signup, password reset)
- **Proposal Management**: Full CRUD operations for agricultural proposals
- **PDF Generation**: Automatic PDF creation with company logo and proposal details
- **Digital Signature**: Canvas-based signature pad for signing proposals (touch/mouse support)
- **Dashboard**: View, edit, and delete proposals with PDF download links
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Backend/Auth**: Supabase (PostgreSQL, Authentication, Storage)
- **Styling**: Tailwind CSS, shadcn/ui components
- **PDF**: jsPDF for document generation
- **Signature**: react-signature-canvas
- **Forms**: React Hook Form with Yup validation
- **Notifications**: React Hot Toast, SweetAlert2

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thioaana/agro-proposals-handling.git
   cd agro-proposals-handling
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the Supabase database table:
   ```sql
   create table agro (
     id uuid default gen_random_uuid() primary key,
     area text not null,
     plant text not null,
     name text not null,
     email text not null,
     pdf_url text,
     user_id uuid references auth.users(id) not null,
     created_at timestamp with time zone default now()
   );
   ```

5. Create a Supabase storage bucket named `proposals` for PDF storage.

### Development

```bash
npm run dev      # Start dev server with Turbopack
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build    # Build for production
npm run start    # Start production server
```

## Project Structure

```
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard with proposal list
│   ├── new-proposal/      # Create/edit proposal form
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   └── SignaturePad.tsx   # Signature canvas component
├── lib/
│   ├── services/          # Supabase CRUD operations
│   ├── supabase/          # Supabase client setup
│   └── utils/             # PDF generation utilities
└── middleware.ts          # Auth session validation
```

## Usage

1. **Sign Up/Login**: Create an account or login to access the app
2. **New Proposal**: Fill in Area, Plant, Name, Email fields
3. **Sign (Optional)**: Draw your signature on the canvas pad
4. **Submit**: PDF is generated and stored automatically
5. **Dashboard**: View all proposals, download PDFs, edit or delete entries

## License

MIT
