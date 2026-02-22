import { z } from "zod";
import QueryResult from "@/components/query-result";
import StatCard from "@/components/stat-card";

export const components = [
  {
    name: "QueryResult",
    description: `Displays data from the Venture Capital database. This component fetches data directly from Supabase.
    
Available tables: vcs

Table columns:
- vcs: id, name, firm, sector, stage, location, ticket_size, portfolio_companies, recently_active, linkedin, website

Use displayType 'table' for data tables, 'bar' for bar charts (e.g., VCs per location), 'line' for trends, 'pie' for proportions.`,
    component: QueryResult,
    propsSchema: z.object({
      table: z.string().describe("Table to query: vcs"),
      columns: z.string().optional().describe("Comma-separated column names to display (e.g., 'name,firm,ticket_size'). Leave empty for all."),
      orderBy: z.string().optional().describe("Column to sort by (e.g., 'firm', 'name', 'location')"),
      orderDirection: z.enum(['asc', 'desc']).optional().describe("Sort direction: 'asc' for ascending, 'desc' for descending"),
      limit: z.number().optional().describe("Max rows to return (default 10)"),
      filter: z.string().optional().describe("Filter in Supabase format: 'column=op.value' (e.g., 'recently_active=eq.true', 'location=eq.Bengaluru')"),
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
      title: z.string().describe("Metric name (e.g., 'Total VCs', 'Active Funds', 'Bengaluru Investors')"),
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
            name: "vcs",
            columns: ["id", "name", "firm", "sector", "stage", "location", "ticket_size", "portfolio_companies", "recently_active", "linkedin", "website"],
            description: "Venture Capitalists and their firm details, investment preferences, and portfolio companies."
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