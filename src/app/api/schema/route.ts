import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/schema
 *
 * Dynamically discovers every user-facing table and its columns from
 * the connected Supabase project by fetching its OpenAPI specification.
 *
 * This approach:
 *  ✅ Works on EVERY Supabase project out of the box
 *  ✅ Requires ZERO user setup (no custom functions, no RLS changes)
 *  ✅ Only needs the anon key (which users already provide)
 *
 * The OpenAPI spec is always available at: GET <supabaseUrl>/rest/v1/
 *
 * Body: { supabaseUrl: string, supabaseKey: string }
 * Returns: { tables: [{ name, columns: [{ column_name, data_type }] }] }
 */
export async function POST(req: NextRequest) {
  try {
    let body: { supabaseUrl?: string; supabaseKey?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { supabaseUrl, supabaseKey } = body;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase URL and Key are required. Please add them in Settings." },
        { status: 400 }
      );
    }

    // Normalize the URL
    let baseUrl: string;
    try {
      const parsed = new URL(supabaseUrl);
      baseUrl = parsed.origin;
    } catch {
      return NextResponse.json(
        { error: "Invalid Supabase URL format." },
        { status: 400 }
      );
    }

    // ── Fetch the OpenAPI spec ──
    // Every Supabase project exposes this at /rest/v1/ with the anon key.
    // No RLS changes or custom functions required.
    const openApiUrl = `${baseUrl}/rest/v1/`;
    const openApiRes = await fetch(openApiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!openApiRes.ok) {
      const text = await openApiRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Failed to fetch schema from Supabase (HTTP ${openApiRes.status}). ` +
            `Check that your Supabase URL and Key are correct. Details: ${text.slice(0, 200)}`,
        },
        { status: 500 }
      );
    }

    const spec = await openApiRes.json();

    // The OpenAPI spec has a "definitions" object where each key is a table name
    // and each value has "properties" describing the columns.
    const definitions = spec.definitions || {};

    const tables = Object.keys(definitions)
      .filter((name) => !name.startsWith("_")) // skip internal/system tables
      .map((tableName) => {
        const tableSpec = definitions[tableName];
        const props = tableSpec?.properties || {};
        const requiredCols: string[] = tableSpec?.required || [];

        const columns = Object.entries(props).map(
          ([colName, colDef]: [string, any]) => {
            // Determine the data type from the spec
            let dataType = colDef.format || colDef.type || "unknown";

            // Map OpenAPI types to more readable SQL-like types
            if (dataType === "integer" || dataType === "int4" || dataType === "int8") {
              dataType = "integer";
            } else if (dataType === "double precision" || dataType === "float8" || dataType === "numeric") {
              dataType = "numeric";
            } else if (dataType === "character varying" || dataType === "text") {
              dataType = "text";
            } else if (dataType === "boolean" || dataType === "bool") {
              dataType = "boolean";
            } else if (dataType === "timestamp with time zone" || dataType === "timestamptz") {
              dataType = "timestamp";
            } else if (dataType === "date") {
              dataType = "date";
            } else if (dataType === "uuid") {
              dataType = "uuid";
            } else if (dataType === "jsonb" || dataType === "json") {
              dataType = "json";
            }

            return {
              column_name: colName,
              data_type: dataType,
              is_nullable: !requiredCols.includes(colName),
            };
          }
        );

        return { name: tableName, columns };
      });

    if (tables.length === 0) {
      return NextResponse.json(
        {
          error:
            "No tables found. Make sure your Supabase project has tables in the public schema " +
            "and that RLS doesn't block the anon key from seeing table definitions.",
          tables: [],
        },
        { status: 200 } // Return 200 with empty tables, not 500
      );
    }

    return NextResponse.json({ tables });
  } catch (err) {
    console.error("API /api/schema error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
