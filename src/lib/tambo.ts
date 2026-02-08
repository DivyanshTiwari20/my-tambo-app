import { z } from "zod";
import QueryResult from "@/components/query-result";
import StatCard from "@/components/stat-card";

export const components = [
  {
    name: "QueryResult",
    description: `Displays data from the e-commerce database. This component fetches data directly from Supabase.
    
Available tables: customers, products, orders, order_items, sales_by_region, monthly_revenue

Table columns:
- customers: id, name, email, phone, city, state, country, signup_date, lifetime_value, is_premium
- products: id, name, category, price, cost, stock_quantity, supplier, rating
- orders: id, customer_id, order_date, total_amount, status, shipping_city, shipping_state
- order_items: id, order_id, product_id, quantity, unit_price, discount_percent
- sales_by_region: id, region, month, total_sales, orders_count, avg_order_value
- monthly_revenue: id, month, revenue, expenses, profit, growth_percent

Use displayType 'table' for data tables, 'bar' for bar charts, 'line' for trends, 'pie' for proportions.`,
    component: QueryResult,
    propsSchema: z.object({
      table: z.string().describe("Table to query: customers, products, orders, order_items, sales_by_region, or monthly_revenue"),
      columns: z.string().optional().describe("Comma-separated column names to display (e.g., 'name,price,category'). Leave empty for all."),
      orderBy: z.string().optional().describe("Column to sort by (e.g., 'price', 'lifetime_value', 'total_amount')"),
      orderDirection: z.enum(['asc', 'desc']).optional().describe("Sort direction: 'asc' for ascending, 'desc' for descending"),
      limit: z.number().optional().describe("Max rows to return (default 10)"),
      filter: z.string().optional().describe("Filter in Supabase format: 'column=op.value' (e.g., 'is_premium=eq.true', 'price=gt.50')"),
      displayType: z.enum(['table', 'bar', 'line', 'pie']).optional().describe("How to display: 'table' (default), 'bar' chart, 'line' chart, or 'pie' chart"),
      xKey: z.string().optional().describe("For charts: column for X-axis (default: first column)"),
      yKey: z.string().optional().describe("For charts: column for Y-axis (default: first numeric column)"),
      title: z.string().optional().describe("Title to display above the result"),
    }),
  },
  {
    name: "StatCard",
    description: "Displays a single statistic in a card format. Use for KPIs, totals, averages, and key metrics.",
    component: StatCard,
    propsSchema: z.object({
      title: z.string().describe("Metric name (e.g., 'Total Revenue', 'Average Order Value')"),
      value: z.union([z.string(), z.number()]).describe("The metric value"),
      subtitle: z.string().optional().describe("Additional context or comparison"),
      icon: z.string().optional().describe("Emoji icon (default: 📊)"),
    }),
  },
];

export const tools = [
  {
    name: "get-available-tables",
    description: "Get list of all available database tables and their columns. Use this when user asks 'what data do you have' or 'what can I query'.",
    tool: async () => {
      return {
        tables: [
          {
            name: "customers",
            columns: ["id", "name", "email", "phone", "city", "state", "country", "signup_date", "lifetime_value", "is_premium"],
            description: "Customer information including location and premium status"
          },
          {
            name: "products",
            columns: ["id", "name", "category", "price", "cost", "stock_quantity", "supplier", "rating"],
            description: "Product catalog with pricing and inventory"
          },
          {
            name: "orders",
            columns: ["id", "customer_id", "order_date", "total_amount", "status", "shipping_city", "shipping_state"],
            description: "Order history and status"
          },
          {
            name: "order_items",
            columns: ["id", "order_id", "product_id", "quantity", "unit_price", "discount_percent"],
            description: "Individual items within each order"
          },
          {
            name: "sales_by_region",
            columns: ["id", "region", "month", "total_sales", "orders_count", "avg_order_value"],
            description: "Aggregated sales data by geographic region and month"
          },
          {
            name: "monthly_revenue",
            columns: ["id", "month", "revenue", "expenses", "profit", "growth_percent"],
            description: "Monthly financial performance tracking"
          }
        ]
      };
    },
    inputSchema: z.object({}),
    outputSchema: z.object({
      tables: z.array(z.object({
        name: z.string(),
        columns: z.array(z.string()),
        description: z.string()
      }))
    }),
  }
];