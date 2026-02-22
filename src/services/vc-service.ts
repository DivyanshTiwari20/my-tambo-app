import { getSupabase } from "@/lib/supabase";

export interface VC {
  id: string;
  name: string;
  firm: string;
  sector: string;
  stage: string;
  location: string;
  ticket_size: string;
  portfolio_companies: string | null;
  recently_active: boolean;
  linkedin: string | null;
  website: string | null;
}

export async function fetchAllVCs(): Promise<VC[]> {
  const { data, error } = await getSupabase()
    .from("vcs")
    .select("*")
    .order("firm", { ascending: true });

  if (error) {
    console.error("Error fetching VCs:", error);
    return [];
  }

  return (data as VC[]) || [];
}
