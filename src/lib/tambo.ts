import { z } from "zod";
import QueryResult from "@/components/query-result";
import StatCard from "@/components/stat-card";

export const components = [
  {
    name: "QueryResult",
    description: `Displays data from the user's connected Supabase database.
    
IMPORTANT: You do NOT know which tables or columns exist. Before using this component,
always call the "get-available-tables" tool first to discover the actual database schema.

This component fetches data from a single table using simple select/filter/order/limit operations.
For charts (pie, bar, line), this component will automatically plot the data you fetch.
If a user asks for aggregated data (like counts or sums) and you cannot write raw SQL, 
you should fetch the raw rows (using a high limit if necessary) and let the chart component 
display the distribution.

Use displayType 'table' for data tables, 'bar' for bar charts, 'line' for trends, 'pie' for proportions.`,
    component: QueryResult,
    propsSchema: z.object({
      table: z
        .string()
        .describe(
          "Table name to query. Must match a real table from get-available-tables."
        ),
      columns: z
        .string()
        .optional()
        .describe(
          "Comma-separated column names to display (e.g., 'name,price,category'). Leave empty for all."
        ),
      orderBy: z
        .string()
        .optional()
        .describe("Column to sort by"),
      orderDirection: z
        .enum(["asc", "desc"])
        .optional()
        .describe("Sort direction: 'asc' or 'desc'"),
      limit: z
        .number()
        .optional()
        .describe("Max rows to return (default 10)"),
      filter: z
        .string()
        .optional()
        .describe(
          "Filter in Supabase format: 'column=op.value' (e.g., 'is_premium=eq.true', 'price=gt.50')"
        ),
      displayType: z
        .enum(["table", "bar", "line", "pie"])
        .optional()
        .describe(
          "How to display: 'table' (default), 'bar' chart, 'line' chart, or 'pie' chart"
        ),
      xKey: z
        .string()
        .optional()
        .describe("For charts: column for X-axis (default: first column)"),
      yKey: z
        .string()
        .optional()
        .describe(
          "For charts: column for Y-axis (default: first numeric column)"
        ),
      title: z
        .string()
        .optional()
        .describe("Title to display above the result"),
    }),
  },

  {
    name: "StatCard",
    description:
      "Displays a single statistic in a card format. Use for KPIs, totals, averages, and key metrics.",
    component: StatCard,
    propsSchema: z.object({
      title: z
        .string()
        .describe(
          "Metric name (e.g., 'Total Revenue', 'Average Order Value')"
        ),
      value: z
        .union([z.string(), z.number()])
        .describe("The metric value"),
      subtitle: z
        .string()
        .optional()
        .describe("Additional context or comparison"),
      icon: z
        .string()
        .optional()
        .describe("Emoji icon (default: 📊)"),
    }),
  },
];

export const tools = [
  {
    name: "get-available-tables",
    description: `Dynamically fetches the list of all tables and their columns from the user's connected Supabase database.
    
ALWAYS call this tool FIRST before using the QueryResult component so you know what tables and columns actually exist. 
Never assume or guess table/column names.

This tool queries the database schema in real time and returns the actual tables and columns available.`,
    tool: async () => {
      // This runs client-side (in the browser) so we can access localStorage
      if (typeof window === "undefined") {
        return { tables: [], error: "Cannot access credentials on server" };
      }

      const supabaseUrl = localStorage.getItem("supabase_url") || "";
      const supabaseKey = localStorage.getItem("supabase_anon_key") || "";

      if (!supabaseUrl || !supabaseKey) {
        return {
          tables: [],
          error:
            "Supabase credentials not configured. Ask the user to add them in Settings.",
        };
      }

      try {
        const res = await fetch("/api/schema", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ supabaseUrl, supabaseKey }),
        });

        const json = await res.json();

        if (!res.ok || json.error) {
          return {
            tables: [],
            error: json.error || "Failed to fetch schema",
          };
        }

        // Format nicely for the AI
        const tables = (json.tables || []).map(
          (t: {
            name: string;
            columns: { column_name: string; data_type: string }[];
          }) => ({
            name: t.name,
            columns: t.columns.map((c) => c.column_name),
            columnTypes: t.columns.map(
              (c) => `${c.column_name} (${c.data_type})`
            ),
          })
        );

        return { tables };
      } catch (err) {
        return {
          tables: [],
          error:
            err instanceof Error ? err.message : "Failed to fetch schema",
        };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({
      tables: z.array(
        z.object({
          name: z.string(),
          columns: z.array(z.string()),
          columnTypes: z.array(z.string()).optional(),
        })
      ),
      error: z.string().optional(),
    }),
  },
];