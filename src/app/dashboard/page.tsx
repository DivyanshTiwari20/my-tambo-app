"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Check,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import { fetchAllVCs, type VC } from "@/services/vc-service";

const SECTORS = [
  "Fintech",
  "SaaS",
  "Healthtech",
  "Edtech",
  "D2C",
  "Deeptech",
] as const;
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B"] as const;
const LOCATIONS = [
  "Mumbai",
  "Bangalore",
  "Delhi",
  "Chennai",
  "Hyderabad",
] as const;
const TICKET_SIZES = [
  "Any",
  "Under $500k",
  "$500k–$2M",
  "Above $2M",
] as const;

const SECTOR_COLORS: Record<string, string> = {
  fintech: "bg-blue-50 text-blue-700",
  saas: "bg-violet-50 text-violet-700",
  healthtech: "bg-emerald-50 text-emerald-700",
  edtech: "bg-amber-50 text-amber-700",
  d2c: "bg-rose-50 text-rose-700",
  deeptech: "bg-cyan-50 text-cyan-700",
};

const LOCATION_ALIASES: Record<string, string[]> = {
  Mumbai: ["mumbai", "bombay"],
  Bangalore: ["bangalore", "bengaluru"],
  Delhi: ["delhi", "new delhi", "ncr"],
  Chennai: ["chennai", "madras"],
  Hyderabad: ["hyderabad"],
};

function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector.toLowerCase().trim()] || "bg-gray-100 text-gray-600";
}

function parseSectors(sector: unknown): string[] {
  if (!sector) return [];
  if (Array.isArray(sector)) return sector.map(String).map((s) => s.trim()).filter(Boolean);
  return String(sector).split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
}

function locationMatches(vcLocation: string, filterLocation: string): boolean {
  const aliases = LOCATION_ALIASES[filterLocation] || [filterLocation.toLowerCase()];
  const loc = (vcLocation || "").toLowerCase();
  return aliases.some((a) => loc.includes(a));
}

function ticketSizeCategory(ticketStr: string | null): string {
  if (!ticketStr) return "Any";
  const lower = ticketStr.toLowerCase().replace(/\s+/g, "");

  const numMatch = lower.match(/([\d.]+)\s*(k|m|b|cr|l)?/);
  if (numMatch) {
    let val = parseFloat(numMatch[1]);
    const unit = numMatch[2];
    if (unit === "k") val *= 1000;
    else if (unit === "m") val *= 1000000;
    else if (unit === "b") val *= 1000000000;
    else if (unit === "cr") val *= 10000000;
    else if (unit === "l") val *= 100000;

    if (val < 500000) return "Under $500k";
    if (val <= 2000000) return "$500k–$2M";
    return "Above $2M";
  }

  if (lower.includes("under") || lower.includes("<500") || lower.includes("angel"))
    return "Under $500k";
  if (lower.includes("500k") && (lower.includes("2m") || lower.includes("2 m")))
    return "$500k–$2M";
  if (lower.includes("above") || lower.includes(">2") || lower.includes("2m+"))
    return "Above $2M";

  return "Any";
}

function calculateMatch(
  vc: VC,
  context: { sector: string; stage: string; raiseAmount: string },
): number {
  let earned = 0;
  let total = 0;

  if (context.sector) {
    total += 40;
    const vcSectors = parseSectors(vc.sector).map((s) => s.toLowerCase());
    if (vcSectors.some((s) => s === context.sector.toLowerCase())) earned += 40;
  }

  if (context.stage) {
    total += 35;
    if ((vc.stage || "").toLowerCase() === context.stage.toLowerCase()) earned += 35;
  }

  if (context.raiseAmount) {
    total += 25;
    const vcCategory = ticketSizeCategory(vc.ticket_size);
    if (context.raiseAmount === "Any" || vcCategory === context.raiseAmount)
      earned += 25;
  }

  return total > 0 ? Math.round((earned / total) * 100) : 0;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2.5">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onChange}
        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
          checked
            ? "bg-gray-900 border-gray-900"
            : "border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function RadioItem({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
          selected ? "border-gray-900" : "border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function SelectDropdown({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 pl-3 pr-8 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

function VCCard({
  vc,
  matchPercent,
  isBookmarked,
  onToggleBookmark,
  onAskAI,
  hasContext,
}: {
  vc: VC;
  matchPercent: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAskAI: () => void;
  hasContext: boolean;
}) {
  const sectors = parseSectors(vc.sector);
  const progressColor =
    matchPercent >= 67
      ? "bg-green-500"
      : matchPercent >= 34
        ? "bg-amber-500"
        : "bg-red-400";

  return (
    <div className="relative border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
      {/* Bookmark */}
      <button
        onClick={onToggleBookmark}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-900 transition-colors"
      >
        {isBookmarked ? (
          <BookmarkCheck className="w-5 h-5 text-gray-900" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
      </button>

      {/* Header */}
      <div className="pr-8 mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {vc.firm}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">{vc.name}</p>
      </div>

      {/* Location + Stage badges */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {vc.location && (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-full">
            {vc.location}
          </span>
        )}
        {vc.stage && (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-full">
            {vc.stage}
          </span>
        )}
      </div>

      {/* Sector pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {sectors.map((s) => (
          <span
            key={s}
            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${getSectorColor(s)}`}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Ticket size */}
      {vc.ticket_size && (
        <p className="text-xs text-gray-500 mb-3">
          Ticket:{" "}
          <span className="font-medium text-gray-700">{vc.ticket_size}</span>
        </p>
      )}

      {/* Match % progress bar */}
      {hasContext && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-400">Match</span>
            <span className="text-xs font-semibold text-gray-700">
              {matchPercent}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${matchPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Active status + Ask AI */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${vc.recently_active ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span className="text-[11px] text-gray-500">
            {vc.recently_active ? "Active" : "Inactive"}
          </span>
        </div>
        <button
          onClick={onAskAI}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          Ask AI
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter();

  const [vcs, setVcs] = useState<VC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTicketSize, setSelectedTicketSize] = useState("Any");
  const [recentlyActiveOnly, setRecentlyActiveOnly] = useState(false);

  const [founderSector, setFounderSector] = useState("");
  const [founderStage, setFounderStage] = useState("");
  const [founderRaise, setFounderRaise] = useState("");

  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    fetchAllVCs()
      .then((data) => {
        setVcs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const toggleFilter = (
    arr: string[],
    val: string,
    setter: (v: string[]) => void,
  ) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedStages([]);
    setSelectedLocations([]);
    setSelectedTicketSize("Any");
    setRecentlyActiveOnly(false);
  };

  const hasActiveFilters =
    selectedSectors.length > 0 ||
    selectedStages.length > 0 ||
    selectedLocations.length > 0 ||
    selectedTicketSize !== "Any" ||
    recentlyActiveOnly;

  const hasFounderContext = !!(founderSector || founderStage || founderRaise);

  const filteredVCs = useMemo(() => {
    const results = vcs
      .filter((vc) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !(vc.name || "").toLowerCase().includes(q) &&
            !(vc.firm || "").toLowerCase().includes(q)
          )
            return false;
        }

        if (selectedSectors.length > 0) {
          const vcSectors = parseSectors(vc.sector).map((s) => s.toLowerCase());
          if (!selectedSectors.some((s) => vcSectors.includes(s.toLowerCase())))
            return false;
        }

        if (selectedStages.length > 0) {
          if (
            !selectedStages.some(
              (s) => (vc.stage || "").toLowerCase() === s.toLowerCase(),
            )
          )
            return false;
        }

        if (selectedLocations.length > 0) {
          if (!selectedLocations.some((loc) => locationMatches(vc.location, loc)))
            return false;
        }

        if (selectedTicketSize !== "Any") {
          if (ticketSizeCategory(vc.ticket_size) !== selectedTicketSize)
            return false;
        }

        if (recentlyActiveOnly && !vc.recently_active) return false;

        return true;
      })
      .map((vc) => ({
        vc,
        matchPercent: calculateMatch(vc, {
          sector: founderSector,
          stage: founderStage,
          raiseAmount: founderRaise,
        }),
      }));

    if (hasFounderContext) {
      results.sort((a, b) => b.matchPercent - a.matchPercent);
    }

    return results;
  }, [
    vcs,
    searchQuery,
    selectedSectors,
    selectedStages,
    selectedLocations,
    selectedTicketSize,
    recentlyActiveOnly,
    founderSector,
    founderStage,
    founderRaise,
    hasFounderContext,
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            VCConnect
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-md"
            >
              Dashboard
            </Link>
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                showBookmarks
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Bookmarks
              {bookmarked.size > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-gray-900 text-white rounded-full flex items-center justify-center">
                  {bookmarked.size}
                </span>
              )}
            </button>
            <Link
              href="/chat"
              className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
            >
              Chat
            </Link>
          </div>
        </div>
      </nav>

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search VCs by name or firm..."
            className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-6 pb-12 flex gap-8">
        {/* ---- Left sidebar filters ---- */}
        <aside className="w-60 shrink-0 hidden lg:block">
          <div className="sticky top-20 space-y-6">
            <FilterSection title="Sector">
              {SECTORS.map((s) => (
                <CheckboxItem
                  key={s}
                  label={s}
                  checked={selectedSectors.includes(s)}
                  onChange={() =>
                    toggleFilter(selectedSectors, s, setSelectedSectors)
                  }
                />
              ))}
            </FilterSection>

            <FilterSection title="Stage">
              {STAGES.map((s) => (
                <CheckboxItem
                  key={s}
                  label={s}
                  checked={selectedStages.includes(s)}
                  onChange={() =>
                    toggleFilter(selectedStages, s, setSelectedStages)
                  }
                />
              ))}
            </FilterSection>

            <FilterSection title="Location">
              {LOCATIONS.map((l) => (
                <CheckboxItem
                  key={l}
                  label={l}
                  checked={selectedLocations.includes(l)}
                  onChange={() =>
                    toggleFilter(selectedLocations, l, setSelectedLocations)
                  }
                />
              ))}
            </FilterSection>

            <FilterSection title="Ticket Size">
              {TICKET_SIZES.map((t) => (
                <RadioItem
                  key={t}
                  label={t}
                  selected={selectedTicketSize === t}
                  onChange={() => setSelectedTicketSize(t)}
                />
              ))}
            </FilterSection>

            {/* Recently Active toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Recently Active Only</span>
              <button
                role="switch"
                aria-checked={recentlyActiveOnly}
                onClick={() => setRecentlyActiveOnly(!recentlyActiveOnly)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  recentlyActiveOnly ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    recentlyActiveOnly ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full h-9 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* ---- Right main content ---- */}
        <main className="flex-1 min-w-0">
          {/* Founder Context Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider shrink-0">
              Your context
            </span>
            <SelectDropdown
              value={founderSector}
              onChange={setFounderSector}
              placeholder="My Sector"
              options={SECTORS}
            />
            <SelectDropdown
              value={founderStage}
              onChange={setFounderStage}
              placeholder="My Stage"
              options={STAGES}
            />
            <SelectDropdown
              value={founderRaise}
              onChange={setFounderRaise}
              placeholder="My Raise Amount"
              options={TICKET_SIZES.filter((t) => t !== "Any")}
            />
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${filteredVCs.length} VCs found`}
            </p>
            {hasFounderContext && (
              <p className="text-xs text-gray-400">Sorted by match %</p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Failed to load VCs: {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredVCs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Search className="w-8 h-8 mb-3" />
              <p className="text-sm">No VCs match your filters</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-gray-900 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* VC Card Grid */}
          {!loading && !error && filteredVCs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredVCs.map(({ vc, matchPercent }) => (
                <VCCard
                  key={vc.id}
                  vc={vc}
                  matchPercent={matchPercent}
                  isBookmarked={bookmarked.has(vc.id)}
                  onToggleBookmark={() => toggleBookmark(vc.id)}
                  onAskAI={() => {
                    const prompt = `Tell me about ${vc.name} from ${vc.firm} and should I pitch them?`;
                    sessionStorage.setItem("vcconnect-ask-ai-prompt", prompt);
                    router.push("/chat");
                  }}
                  hasContext={hasFounderContext}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating chat button */}
      <Link
        href="/chat"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
        aria-label="Open Chat"
      >
        <Sparkles className="w-5 h-5" />
      </Link>

      {/* Bookmarks slide-over */}
      {showBookmarks && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowBookmarks(false)}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-200 shrink-0">
              <h2 className="text-sm font-semibold text-gray-900">
                Bookmarked VCs ({bookmarked.size})
              </h2>
              <button
                onClick={() => setShowBookmarks(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {bookmarked.size === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Bookmark className="w-8 h-8 mb-3" />
                  <p className="text-sm">No bookmarked VCs yet</p>
                  <p className="text-xs mt-1">
                    Click the bookmark icon on any card to save it here
                  </p>
                </div>
              ) : (
                vcs
                  .filter((vc) => bookmarked.has(vc.id))
                  .map((vc) => {
                    const matchPercent = calculateMatch(vc, {
                      sector: founderSector,
                      stage: founderStage,
                      raiseAmount: founderRaise,
                    });
                    return (
                      <VCCard
                        key={vc.id}
                        vc={vc}
                        matchPercent={matchPercent}
                        isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark(vc.id)}
                        onAskAI={() => {
                          const prompt = `Tell me about ${vc.name} from ${vc.firm} and should I pitch them?`;
                          sessionStorage.setItem(
                            "vcconnect-ask-ai-prompt",
                            prompt,
                          );
                          router.push("/chat");
                        }}
                        hasContext={hasFounderContext}
                      />
                    );
                  })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
