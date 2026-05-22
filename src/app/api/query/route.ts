import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface QueryBody {
  supabaseUrl: string;
  supabaseKey: string;
  userQuery: {
    table: string;
    columns?: string;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    limit?: number;
    filter?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    let body: QueryBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { supabaseUrl, supabaseKey, userQuery } = body;

    // ── Validate credentials ──
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase URL and Key are required. Please add them in Settings." },
        { status: 400 }
      );
    }

    if (!userQuery?.table) {
      return NextResponse.json(
        { error: "A table name is required in userQuery" },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: string;
    try {
      const parsed = new URL(supabaseUrl);
      validUrl = parsed.origin; // normalize
    } catch {
      return NextResponse.json(
        { error: "Invalid Supabase URL format" },
        { status: 400 }
      );
    }

    // ── Create a Supabase client with user-supplied credentials ──
    const supabase = createClient(validUrl, supabaseKey);

    // ── Sanitize columns: strip trailing commas, empty segments, whitespace ──
    const rawCols = userQuery.columns?.trim();
    const sanitizedColumns = rawCols
      ? rawCols
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0)
          .join(",")
      : "*";

    // ── Build the query ──
    let query = supabase
      .from(userQuery.table)
      .select(sanitizedColumns || "*");

    // Ordering
    if (userQuery.orderBy) {
      query = query.order(userQuery.orderBy, {
        ascending: userQuery.orderDirection === "asc",
      });
    }

    // Limit
    if (userQuery.limit && userQuery.limit > 0) {
      query = query.limit(userQuery.limit);
    }

    // Filter (format: column=op.value   e.g. is_premium=eq.true)
    if (userQuery.filter) {
      const eqIndex = userQuery.filter.indexOf("=");
      if (eqIndex > 0) {
        const column = userQuery.filter.substring(0, eqIndex);
        const opValue = userQuery.filter.substring(eqIndex + 1);
        const dotIndex = opValue.indexOf(".");
        if (dotIndex > 0) {
          const operator = opValue.substring(0, dotIndex);
          const value = opValue.substring(dotIndex + 1);

          switch (operator) {
            case "eq":
              query = query.eq(
                column,
                value === "true" ? true : value === "false" ? false : value
              );
              break;
            case "neq":
              query = query.neq(column, value);
              break;
            case "gt":
              query = query.gt(column, Number(value));
              break;
            case "lt":
              query = query.lt(column, Number(value));
              break;
            case "gte":
              query = query.gte(column, Number(value));
              break;
            case "lte":
              query = query.lte(column, Number(value));
              break;
            case "like":
              query = query.like(column, value);
              break;
            case "ilike":
              query = query.ilike(column, value);
              break;
          }
        }
      }
    }

    // ── Execute ──
    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error("API /api/query error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
