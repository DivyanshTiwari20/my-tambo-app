import { z } from "zod";
import QueryResult from "@/components/query-result";
import StatCard from "@/components/stat-card";

export const components = [
  {
    name: "QueryResult",
    description: `Displays data from the user's connected Supabase database as a table or chart.

STEP 1 — Always call "get-available-tables" first. Never guess table or column names.

STEP 2 — Choose displayType:
- "table": Default. Use for raw data, lists, search results.
- "bar": Use for comparisons across categories (e.g. revenue by city, users by plan).
- "line": Use for trends over time (e.g. signups per month).
- "pie": Use ONLY when there are 2–5 distinct categories and you want share/proportion. Never use pie for time-series or when categories exceed 6.

STEP 3 — For ANY chart (bar, line, pie), you MUST explicitly set:
- xKey: the column representing categories or time (string/date column)
- yKey: the column representing the numeric value (number column)
Never leave these empty for charts — auto-detection will fail.

STEP 4 — Limits:
- For tables: limit 10–20 is fine.
- For charts: use limit 50–200 so aggregation has enough data.
- For pie: use limit 500+ since rows need to be grouped by category.

STEP 5 — Aggregation warning:
If the user asks for something like "revenue by month" or "users by city", note that this component displays raw rows — it does not run GROUP BY. If the table has a category column (e.g. "plan", "city", "gender"), select that column and a numeric column; the chart will aggregate counts. If the data needs SQL-level aggregation, tell the user the result may be approximate.

NEVER use pie when only one category or value exists — it will render blank.`,

    component: QueryResult,
    propsSchema: z.object({
      table: z
        .string()
        .describe("Table name. Must match exactly from get-available-tables."),
      columns: z
        .string()
        .optional()
        .describe(
          "Comma-separated columns to fetch (e.g. 'name,price,category'). For charts, always include xKey and yKey columns. Leave empty only for simple table views."
        ),
      orderBy: z.string().optional().describe("Column to sort by."),
      orderDirection: z
        .enum(["asc", "desc"])
        .optional()
        .describe("Sort direction."),
      limit: z
        .number()
        .optional()
        .describe(
          "Rows to fetch. Default 10 for tables. Use 100–500 for charts and pie so grouping works correctly."
        ),
      filter: z
        .string()
        .optional()
        .describe(
          "Supabase filter: 'column=op.value'. Examples: 'status=eq.active', 'amount=gt.100', 'created_at=gte.2024-01-01'."
        ),
      displayType: z
        .enum(["table", "bar", "line", "pie"])
        .optional()
        .describe(
          "Visualization type. Default: 'table'. Use 'bar' for category comparisons, 'line' for time trends, 'pie' for 2–5 category proportions only."
        ),
      xKey: z
        .string()
        .optional()
        .describe(
          "REQUIRED for charts. Column for X-axis or pie labels — usually a string/date column like 'city', 'plan', 'month'. Always set this explicitly when displayType is bar, line, or pie."
        ),
      yKey: z
        .string()
        .optional()
        .describe(
          "REQUIRED for charts. Column for Y-axis or pie values — must be a numeric column like 'revenue', 'count', 'amount'. Always set this explicitly when displayType is bar, line, or pie."
        ),
      title: z
        .string()
        .optional()
        .describe(
          "Chart or table title shown above the result. Always set a clear, human-readable title."
        ),
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