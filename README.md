# SQL Query Builder

> 🚀 A natural language SQL query builder powered by AI. Ask questions in plain English, get instant data visualizations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![Tambo AI](https://img.shields.io/badge/Tambo-AI-purple?style=flat-square)

## 📖 Overview

SQL Query Builder is an AI-powered application that transforms natural language questions into database queries and beautiful visualizations. Instead of writing complex SQL, simply ask questions like:

- *"Show me the top 10 products by price"*
- *"Display monthly revenue as a line chart"*
- *"List all premium customers"*

The AI understands your intent, queries your Supabase database, and renders the results as interactive tables, bar charts, line charts, or pie charts.

## ✨ Features

- **🗣️ Natural Language Queries** - Ask questions in plain English
- **📊 Auto Visualizations** - Data automatically rendered as charts or tables
- **📈 Multiple Chart Types** - Bar, Line, Pie charts with Recharts
- **🔄 Real-time Data** - Direct integration with Supabase
- **🎨 Clean UI** - Minimalist, developer-focused interface
- **⚡ Fast** - Built on Next.js 15 with React 19

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Tambo AI](https://tambo.co/) | AI-powered generative UI |
| [Supabase](https://supabase.com/) | PostgreSQL database |
| [Recharts](https://recharts.org/) | Data visualization |
| [Zod](https://zod.dev/) | Schema validation |

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- A **Supabase** account and project
- A **Tambo AI** API key (free at [tambo.co](https://tambo.co/dashboard))

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/DivyanshTiwari20/my-tambo-app.git
cd my-tambo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

The app requires specific environment variables to function properly. There is no UI prompt for the API key, so you **must** supply it in the `.env` file before running the application.

Create a `.env.local` or `.env` file in the root directory and add the following:

```env
# Tambo AI Configuration (REQUIRED for chat to work)
# Get your API key for free at https://tambo.co/dashboard
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here

# Supabase Configuration (REQUIRED for database queries)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Set up Supabase Database

Create the following tables in your Supabase project:

```sql
-- Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  signup_date DATE,
  lifetime_value DECIMAL(10,2),
  is_premium BOOLEAN DEFAULT false
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  stock_quantity INTEGER,
  supplier TEXT,
  rating DECIMAL(3,2)
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date DATE,
  total_amount DECIMAL(10,2),
  status TEXT,
  shipping_city TEXT,
  shipping_state TEXT
);

-- Order Items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  discount_percent DECIMAL(5,2)
);

-- Sales by Region table
CREATE TABLE sales_by_region (
  id SERIAL PRIMARY KEY,
  region TEXT,
  month TEXT,
  total_sales DECIMAL(12,2),
  orders_count INTEGER,
  avg_order_value DECIMAL(10,2)
);

-- Monthly Revenue table
CREATE TABLE monthly_revenue (
  id SERIAL PRIMARY KEY,
  month TEXT,
  revenue DECIMAL(12,2),
  expenses DECIMAL(12,2),
  profit DECIMAL(12,2),
  growth_percent DECIMAL(5,2)
);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
my-tambo-app/
├── src/
│   ├── app/
│   │   ├── chat/
│   │   │   └── page.tsx          # Chat interface page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── query-result.tsx      # Self-fetching data component
│   │   ├── stat-card.tsx         # KPI display card
│   │   ├── data-chart.tsx        # Chart component
│   │   ├── data-table.tsx        # Table component
│   │   └── tambo/                # Tambo UI components
│   │       ├── message-thread-full.tsx
│   │       ├── message-input.tsx
│   │       └── ...
│   └── lib/
│       ├── tambo.ts              # Tambo configuration
│       ├── supabase.ts           # Supabase client
│       └── utils.ts              # Utility functions
├── .env.local                    # Environment variables
├── package.json
└── README.md
```

## 🔧 How It Works

### Architecture Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│  Tambo AI   │────▶│  Component  │────▶│  Supabase   │
│   Query     │     │  Processing │     │  Rendering  │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │  "Show top 10     │  Interprets       │  QueryResult      │  Returns
       │   products"       │  intent &         │  component        │  JSON data
       │                   │  selects          │  fetches data     │
       │                   │  component        │  directly         │
       └───────────────────┴───────────────────┴───────────────────┘
```

### Key Components

#### 1. QueryResult Component (`/src/components/query-result.tsx`)

A self-fetching React component that:
- Receives query parameters as props (table, columns, filters, etc.)
- Fetches data directly from Supabase when rendered
- Automatically displays as table, bar chart, line chart, or pie chart

```tsx
<QueryResult 
  table="products"
  orderBy="price"
  orderDirection="desc"
  limit={10}
  displayType="bar"
  title="Top 10 Products by Price"
/>
```

#### 2. Tambo Configuration (`/src/lib/tambo.ts`)

Registers components and their schemas with Tambo AI:

```typescript
export const components = [
  {
    name: "QueryResult",
    description: "Displays data from the database...",
    component: QueryResult,
    propsSchema: z.object({
      table: z.string(),
      displayType: z.enum(['table', 'bar', 'line', 'pie']),
      // ... more props
    }),
  },
];
```

#### 3. Supabase Client (`/src/lib/supabase.ts`)

Initializes the Supabase client for database queries:

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## 🎯 Usage Examples

| Query | Result |
|-------|--------|
| "Show me top 10 products by price" | Bar chart of expensive products |
| "List all premium customers" | Table of premium customers |
| "Monthly revenue trend" | Line chart of revenue over time |
| "Sales by region breakdown" | Pie chart of regional sales |
| "What tables are available?" | List of all database tables |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Tambo AI](https://tambo.co/) - For the generative UI framework
- [Supabase](https://supabase.com/) - For the database platform
- [Recharts](https://recharts.org/) - For beautiful charts
- [Vercel](https://vercel.com/) - For Next.js and hosting

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/DivyanshTiwari20">Divyansh Tiwari</a>
</p>