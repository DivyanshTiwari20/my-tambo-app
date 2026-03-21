import { NextRequest } from "next/server";

// Using the standard Tambo AI backend base url
const TAMBO_API_BASE = "https://api.tambo.co";

async function proxy(req: NextRequest) {
  // Extract the path segments after /api/tambo
  const path = req.nextUrl.pathname.replace("/api/tambo", "");
  const searchParams = req.nextUrl.search;
  
  const targetUrl = `${TAMBO_API_BASE}${path}${searchParams}`;
  
  // Clone request headers and safely inject the hidden Developer API key
  const headers = new Headers(req.headers);
  headers.set("host", "api.tambo.co");
  
  // We grab the key from process.env (even though it's currently named NEXT_PUBLIC...)
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY || "";
  headers.set("x-api-key", apiKey);
  headers.delete("authorization"); // clear any dummy bearer token the frontend might have sent
  
  // We must delete the proxy's origin/referer to avoid CORS issues on the Tambo servers
  headers.delete("origin");
  headers.delete("referer");

  // Read the body if the request isn't a GET or HEAD
  const body = (req.method !== "GET" && req.method !== "HEAD") ? await req.blob() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err) {
    console.error("Tambo Proxy Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Proxy Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
