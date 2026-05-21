"use client";

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, Filter, BarChart, CircleDot, 
  Send, Database, ArrowUpRight, Check, Play, HelpCircle, 
  ChevronDown, Search, Plus, Settings, MessageSquare, Star, 
  RotateCw, Activity, ArrowLeftRight
} from 'lucide-react';

interface ConversationData {
  id: string;
  name: string;
  timestamp: string;
  category: 'Today' | 'Yesterday';
  userPrompt: string;
  systemMessage: string;
  cardTitle: string;
  cardSubtitle: string;
  badgeText: string;
  badgeSubText: string;
  legendItems: { name: string; color: string }[];
  chartType: 'bar' | 'mrr-line' | 'funnel' | 'retention-grid' | 'user-growth' | 'churn-stat';
}

const customConversations: ConversationData[] = [
  {
    id: 'weekly-users',
    name: 'Weekly New Users Comparison',
    timestamp: '12:45 PM',
    category: 'Today',
    userPrompt: 'Show me how many users Join the app in this Week compared to the last week Then show the result in the bar chart',
    systemMessage: "Here's the comparison of users who joined the app this week vs. last week. The bar chart below shows the total number of new users for each week.",
    cardTitle: 'New Users Comparison',
    cardSubtitle: 'This Week vs. Last Week',
    badgeText: '+18.1%',
    badgeSubText: 'vs. Last Week (+232 new users)',
    legendItems: [
      { name: 'This Week', color: 'bg-emerald-500' },
      { name: 'Last Week', color: 'bg-slate-400' }
    ],
    chartType: 'bar'
  },
  {
    id: 'user-growth',
    name: 'User Growth Overview',
    timestamp: '11:20 AM',
    category: 'Today',
    userPrompt: 'What is our month-over-month signup trends for user growth?',
    systemMessage: "Our user signup volume has grown consistently. We recorded a substantial 32% spike in signups directly following our public product announcement.",
    cardTitle: 'MoM Growth Trajectory',
    cardSubtitle: 'Monthly cumulative signups',
    badgeText: '+32.4%',
    badgeSubText: 'MoM customer signups',
    legendItems: [
      { name: 'Cumulative Signups', color: 'bg-emerald-500' }
    ],
    chartType: 'user-growth'
  },
  {
    id: 'mrr-trends',
    name: 'Revenue Trends Analysis',
    timestamp: '10:05 AM',
    category: 'Today',
    userPrompt: 'Compare our MRR growth and customer acquisition over the last 5 months',
    systemMessage: "Here is your Monthly Recurring Revenue (MRR) growth trajectory. Customer acquisition across Stripe payments has accelerated by 27.8% since last quarter, driven by our brand launch.",
    cardTitle: 'Monthly Recurring Revenue',
    cardSubtitle: 'Jan 2026 - May 2026',
    badgeText: '$78,000 MRR',
    badgeSubText: '+27.8% subscription growth',
    legendItems: [
      { name: 'Monthly Recurring Revenue', color: 'bg-emerald-500' }
    ],
    chartType: 'mrr-line'
  },
  {
    id: 'top-features',
    name: 'Top Performing Features',
    timestamp: '9:15 AM',
    category: 'Today',
    userPrompt: 'Which platform features are experiencing the highest query frequency this week?',
    systemMessage: "Based on active query logs, 'VPC DB Queries' and 'Visual Funnel Synthesizer' have captured over 74% of all platform executions this month.",
    cardTitle: 'Query Volume by Feature',
    cardSubtitle: 'Execution volume breakdown',
    badgeText: '74%',
    badgeSubText: 'Concentrated on Top 2 features',
    legendItems: [
      { name: 'Executions Count', color: 'bg-emerald-500' }
    ],
    chartType: 'funnel' // we can reuse funnel/bar UI
  },
  {
    id: 'retention-rate',
    name: 'Retention Rate Insights',
    timestamp: 'Yesterday, 4:30 PM',
    category: 'Yesterday',
    userPrompt: 'Show our cohort retention matrix over the past few weeks to see if day-30 active rates are stabilizing',
    systemMessage: "Day-30 signup retention is stabilizing at an average baseline of 51.2%. cohorts subscribing via Stripe during the beta cycle show an even stronger 63.5% active retention rate.",
    cardTitle: 'Cohort Retention Map',
    cardSubtitle: 'User return patterns by group',
    badgeText: '51.2%',
    badgeSubText: 'Day-30 avg retention rate',
    legendItems: [
      { name: '100% Retention', color: 'bg-emerald-600' },
      { name: '50% - 80% Retention', color: 'bg-emerald-400' },
      { name: '< 50% Retention', color: 'bg-emerald-100' }
    ],
    chartType: 'retention-grid'
  },
  {
    id: 'daily-active',
    name: 'Daily Active Users Trend',
    timestamp: 'Yesterday, 2:10 PM',
    category: 'Yesterday',
    userPrompt: 'Let\'s plot the Daily Active Users (DAU) over the last 14 days to monitor weekend activity drop-offs',
    systemMessage: "Weekend activity remains stable, dropping by only 8.4% compared to standard business weekdays. Tuesday/Wednesday represent peak usage windows.",
    cardTitle: 'Daily Active Users (DAU)',
    cardSubtitle: '14-Day Activity Log',
    badgeText: '14,250 DAU',
    badgeSubText: 'Stable weekday average (+4.2%)',
    legendItems: [
      { name: 'Active Users', color: 'bg-emerald-500' }
    ],
    chartType: 'mrr-line' // Reuse line UI with other metrics
  },
  {
    id: 'conversion-funnel',
    name: 'Conversion Funnel Analysis',
    timestamp: 'Yesterday, 11:45 AM',
    category: 'Yesterday',
    userPrompt: 'Let\'s see the user conversion funnel from visitor to trial and paid subscription for our Q1 campaigns',
    systemMessage: "I've analyzed user sessions from our Q1 marketing campaign. The largest drop-off occurs at the 'Profile Completed' state, whereas users who complete onboarding convert at an exceptionally high rate.",
    cardTitle: 'Marketing Campaign Funnel',
    cardSubtitle: 'Visitor-to-Paid subscription funnel',
    badgeText: '14.6%',
    badgeSubText: 'Conversion Rate (+2.4% vs Startup benchmarking)',
    legendItems: [
      { name: 'Conversion Volume', color: 'bg-emerald-500' }
    ],
    chartType: 'funnel'
  },
  {
    id: 'churn-rate',
    name: 'Churn Rate Overview',
    timestamp: 'Yesterday, 9:00 AM',
    category: 'Yesterday',
    userPrompt: 'Summarize our current user churn and lists trigger components',
    systemMessage: "Account churn has lowered to a historic bottom of 1.4% as team-collaboration features went live.",
    cardTitle: 'Churn & Contraction Matrix',
    cardSubtitle: 'Monthly revenue loss metrics',
    badgeText: '1.4%',
    badgeSubText: 'Below 2.0% industry standard',
    legendItems: [
      { name: 'Active subscriber churn', color: 'bg-rose-500' }
    ],
    chartType: 'churn-stat'
  }
];

export default function HeroSandbox() {
  const [activeId, setActiveId] = useState<string>('weekly-users');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [customQueryInput, setCustomQueryInput] = useState<string>('');

  const activeConv = customConversations.find(c => c.id === activeId) || customConversations[0];

  // Simulated typing effect
  useEffect(() => {
    setIsTyping(true);
    setTypedMessage('');
    let index = 0;
    const fullText = activeConv.systemMessage;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedMessage(prev => prev + fullText.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 4);

    return () => clearInterval(timer);
  }, [activeId]);

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customQueryInput.trim()) return;

    const queryLower = customQueryInput.toLowerCase();
    let matchedId = 'weekly-users';

    if (queryLower.includes('revenue') || queryLower.includes('mrr') || queryLower.includes('money')) {
      matchedId = 'mrr-trends';
    } else if (queryLower.includes('funnel') || queryLower.includes('conversion')) {
      matchedId = 'conversion-funnel';
    } else if (queryLower.includes('retention') || queryLower.includes('cohort')) {
      matchedId = 'retention-rate';
    } else if (queryLower.includes('growth') || queryLower.includes('signup')) {
      matchedId = 'user-growth';
    } else if (queryLower.includes('churn')) {
      matchedId = 'churn-rate';
    } else if (queryLower.includes('active') || queryLower.includes('dau')) {
      matchedId = 'daily-active';
    } else {
      matchedId = 'weekly-users';
    }

    setActiveId(matchedId);
    setCustomQueryInput('');
  };

  const filteredConvs = customConversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIcon = (id: string, className = "h-3.5 w-3.5") => {
    switch (id) {
      case 'weekly-users': return <Users className={className} />;
      case 'user-growth': return <BarChart className={className} />;
      case 'mrr-trends': return <TrendingUp className={className} />;
      case 'top-features': return <Star className={className} />;
      case 'retention-rate': return <RotateCw className={className} />;
      case 'daily-active': return <Activity className={className} />;
      case 'conversion-funnel': return <Filter className={className} />;
      case 'churn-rate': return <ArrowLeftRight className={className} />;
      default: return <CircleDot className={className} />;
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-24 border-b border-gray-150 select-none">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-35 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Tagline */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-50/70 px-4 py-1.5 text-xs font-mono font-extrabold tracking-widest text-[#059669] uppercase">
            LIVE COMPLIANT APP PREVIEW
          </span>
        </div>

        {/* Dynamic Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-950 leading-[1.08] max-w-4xl mx-auto mb-5">
          Tambo is conversational analytics <br />
          <span className="text-emerald-500">connected directly to your database.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-650 max-w-3xl mx-auto leading-relaxed font-sans font-medium mb-10">
          Stop writing SQL. Stop struggling with 40-filter dashboards. Just ask questions in normal words, and Tambo synthesizes visual report structures in real-time.
        </p>

        {/* Interactive Dashboard Workspace: REPLICATING SCREENSHOT 1 */}
        <div className="mt-8 text-left bg-white border border-gray-200/90 rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
          
          {/* Main Top Header mimicking browser toolbar or app status */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#FCFCFC] border-b border-gray-150 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
              <span className="ml-2 font-mono text-xs font-bold text-gray-500">tambo-app-instance (production)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-3 py-1 rounded-md">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              <span>Db Connected: Postgresql Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
            
            {/* LEFT SIDEBAR: Matches Screenshot 1 exact layout */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#FCFCFC] border-b md:border-b-0 md:border-r border-gray-150 flex flex-col justify-between select-none">
              
              <div className="p-4 space-y-4">
                
                {/* Brand Logo & arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                      <BarChart className="h-4.5 w-4.5 stroke-[2.5]" />
                    </div>
                    <span className="font-sans font-extrabold text-xl tracking-tight text-gray-900">tambo</span>
                  </div>
                  <button className="p-1 rounded hover:bg-gray-100 border border-gray-150 bg-white" aria-label="Collapse info">
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500 rotate-90" />
                  </button>
                </div>

                {/* + New Conversation Button */}
                <button 
                  onClick={() => setActiveId('weekly-users')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-extrabold text-[#111] inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="h-4 w-4 text-emerald-500 stroke-[3]" />
                  <span>New conversation</span>
                </button>

                {/* Search query box */}
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-2.5 " style={{ top: "11px" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Today Category */}
                <div className="space-y-1">
                  <span className="text-xs font-mono font-extrabold text-gray-550 uppercase block py-1">Today</span>
                  <div className="space-y-1.5">
                    {filteredConvs.filter(c => c.category === 'Today').map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                          activeId === c.id
                            ? 'bg-emerald-50 border border-emerald-500/10 text-emerald-900 font-extrabold'
                            : 'hover:bg-gray-100/70 border border-transparent text-gray-700 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[80%]">
                          {renderIcon(c.id, `h-4 w-4 ${activeId === c.id ? 'text-emerald-600' : 'text-gray-500'}`)}
                          <span className="text-sm truncate leading-none">{c.name}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-450 whitespace-nowrap shrink-0">{c.timestamp}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Yesterday Category */}
                <div className="space-y-1">
                  <span className="text-xs font-mono font-extrabold text-gray-550 uppercase block py-1">Yesterday</span>
                  <div className="space-y-1.5">
                    {filteredConvs.filter(c => c.category === 'Yesterday').map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                          activeId === c.id
                            ? 'bg-emerald-50 border border-emerald-500/10 text-emerald-900 font-extrabold'
                            : 'hover:bg-gray-100/70 border border-transparent text-gray-700 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[80%]">
                          {renderIcon(c.id, `h-4 w-4 ${activeId === c.id ? 'text-emerald-600' : 'text-gray-500'}`)}
                          <span className="text-sm truncate leading-none">{c.name}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-450 whitespace-nowrap shrink-0">9:00 AM</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Info Row */}
              <div className="p-4 border-t border-gray-150 space-y-3.5 bg-white">
                <div className="flex items-center gap-3 text-sm text-gray-700 px-1 py-0.5 cursor-pointer hover:text-gray-900 font-extrabold">
                  <Settings className="h-4.5 w-4.5 text-gray-605" />
                  <span>Settings</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 px-1 py-0.5 cursor-pointer hover:text-gray-900 font-extrabold">
                  <HelpCircle className="h-4.5 w-4.5 text-gray-605" />
                  <span>Help & Support</span>
                </div>

                {/* User Row mimic */}
                <div className="border-t border-gray-150 pt-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm select-none">
                      A
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-gray-950 truncate leading-tight">Admin User</p>
                      <p className="text-xs text-gray-450 truncate leading-none mt-1 font-mono">admin@tambo.ai</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

            </div>

            {/* RIGHT CONVERSATION CHAT VIEWPORT */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col justify-between bg-white relative">
              
              {/* Settings button placeholder upper right */}
              <button className="absolute top-4 right-4 p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 bg-white shadow-xs cursor-pointer z-20" aria-label="Toggle layout configuration">
                <Settings className="h-4.5 w-4.5 text-gray-605" />
              </button>

              {/* Thread space */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                
                {/* User Prompt Message bubble (aligned right, clean soft background) */}
                <div className="flex justify-end pr-10">
                  <div className="max-w-[85%] bg-slate-50 border border-gray-150/80 rounded-2xl px-4 py-3 text-sm sm:text-base text-gray-800 font-sans font-bold shadow-xs">
                    {activeConv.userPrompt}
                  </div>
                </div>

                {/* System response statement */}
                <div className="space-y-1.5 max-w-xl pl-1 text-left">
                  <div className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1.5 uppercase tracking-wider select-none mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
                    <span>Tambo Agent response</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-bold">
                    {isTyping ? (
                      <span>
                        {typedMessage}
                        <span className="inline-block w-1.5 h-4.5 bg-emerald-500 ml-1 animate-pulse" />
                      </span>
                    ) : (
                      activeConv.systemMessage
                    )}
                  </p>
                </div>

                {/* HIGH FIDELITY CARD: REPLICATING SCREENSHOT 1 WIDGET CARD */}
                <AnimatePresence mode="wait">
                  {!isTyping && (
                    <motion.div
                      key={activeConv.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-gray-200 bg-white rounded-2xl shadow-lg shadow-gray-100 p-6 max-w-xl border-t-2 border-t-emerald-500 relative"
                    >
                      
                      {/* Top Header Row of Card */}
                      <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4 select-none">
                        <div>
                          <h3 className="font-sans font-extrabold text-base sm:text-lg text-gray-900 leading-tight">{activeConv.cardTitle}</h3>
                          <p className="text-xs text-gray-450 font-sans font-bold mt-1.5">{activeConv.cardSubtitle}</p>
                        </div>
                        
                        {/* High stat green badge */}
                        <div className="text-right bg-emerald-50 border border-emerald-100/80 rounded-lg px-3 py-1.5 max-w-[200px]">
                          <span className="text-base sm:text-lg font-extrabold text-[#059669] block leading-none">{activeConv.badgeText}</span>
                          <span className="text-xs text-[#047857] font-bold mt-1 block whitespace-nowrap leading-none">{activeConv.badgeSubText}</span>
                        </div>
                      </div>

                      {/* Legend Selection Indicators */}
                      <div className="flex items-center gap-4 mb-4 select-none">
                        {activeConv.legendItems.map((leg) => (
                          <div key={leg.name} className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-md ${leg.color} inline-block shadow-xs`} />
                            <span className="text-xs sm:text-sm font-bold text-gray-600">{leg.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* CHART LAYOUT DEPENDING ON SELECTED CONVERSATION */}
                      <div className="py-2">
                        
                        {/* 1. Bar Chart: Replica of Screenshot 1 (Y-Axis, Grid Lines, Columns) */}
                        {activeConv.chartType === 'bar' && (
                          <div className="grid grid-cols-12 gap-3 items-stretch h-52">
                            {/* Y-Axis Labels */}
                            <div className="col-span-2 flex flex-col justify-between text-xs text-gray-500 font-mono font-bold select-none pr-1.5">
                              <span>2,000</span>
                              <span>1,750</span>
                              <span>1,500</span>
                              <span>1,250</span>
                              <span>1,000</span>
                              <span>750</span>
                              <span>500</span>
                              <span>250</span>
                              <span className="text-right">0</span>
                            </div>

                            {/* Chart Columns & Grid */}
                            <div className="col-span-10 relative border-l border-b border-gray-150 flex items-end justify-around pb-2">
                              {/* Horizontal dotted gridlines */}
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-1">
                                {[...Array(8)].map((_, i) => (
                                  <div key={i} className="w-full border-t border-dotted border-gray-150/60 h-0" />
                                ))}
                              </div>

                              {/* Col 1: This Week */}
                              <div className="flex flex-col items-center z-10 w-24">
                                <span className="text-xs font-extrabold text-gray-950 mb-1.5">1,515</span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '144px' }} // Approx 1515/2000 of canvas height
                                  transition={{ duration: 0.4 }}
                                  className="w-14 rounded-md bg-emerald-500 hover:bg-emerald-600 cursor-pointer shadow-sm transition-colors"
                                />
                                <span className="text-xs font-bold text-gray-650 mt-2 font-sans">This Week</span>
                              </div>

                              {/* Col 2: Last Week */}
                              <div className="flex flex-col items-center z-10 w-24">
                                <span className="text-xs font-extrabold text-gray-650 mb-1.5">1,283</span>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: '122px' }} // Approx 1283/2000
                                  transition={{ duration: 0.4 }}
                                  className="w-14 rounded-md bg-slate-400 hover:bg-slate-500 cursor-pointer transition-colors"
                                />
                                <span className="text-xs font-bold text-gray-500 mt-2 font-sans">Last Week</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. MRR Line Graph: Silk smooth Custom SVG with markers */}
                        {activeConv.chartType === 'mrr-line' && (
                          <div className="space-y-4">
                            <div className="h-44 relative border-l border-b border-gray-150/80">
                              {/* Dotted threshold line */}
                              <div className="absolute top-[30%] w-full border-t border-dashed border-gray-150/70 text-xs font-mono font-bold text-gray-500 pt-1">
                                Goal Threshold ($50k) Passed &uarr;
                              </div>

                              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M 10,110 L 100,90 L 190,75 L 280,45 L 390,15 L 390,120 L 10,120 Z"
                                  fill="url(#glowGrad)"
                                />
                                <path
                                  d="M 10,110 L 100,90 L 190,75 L 280,45 L 390,15"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                                <circle cx="10" cy="110" r="4.5" fill="#10b981" className="cursor-pointer" />
                                <circle cx="100" cy="90" r="4.5" fill="#10b981" />
                                <circle cx="190" cy="75" r="4.5" fill="#10b981" />
                                <circle cx="280" cy="45" r="4.5" fill="#10b981" />
                                <circle cx="390" cy="15" r="4.5" fill="#10b981" />
                              </svg>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 font-mono font-bold px-1 uppercase">
                              <span>Jan ($34k)</span>
                              <span>Feb ($42k)</span>
                              <span>Mar ($49k)</span>
                              <span>Apr ($61k)</span>
                              <span>May ($78k)</span>
                            </div>
                          </div>
                        )}

                        {/* 3. Funnel conversion stage */}
                        {activeConv.chartType === 'funnel' && (
                          <div className="space-y-3">
                            {[
                              { stage: 'Unique Visitors', count: '12,500', width: 'w-full', pct: '100%' },
                              { stage: 'Signed Up', count: '4,800', width: 'w-[72%]', pct: '38.4%' },
                              { stage: 'Completed Profile', count: '2,200', width: 'w-[45%]', pct: '17.6%' },
                              { stage: 'Active Onboarding', count: '1,850', width: 'w-[38%]', pct: '14.8%' },
                              { stage: 'Paid Subscriptions', count: '703', width: 'w-[20%]', pct: '5.6%', isGoal: true }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <span className="w-32 text-xs text-gray-600 font-bold truncate block">{item.stage}</span>
                                <div className="flex-1 bg-gray-50 rounded-lg h-6 relative flex items-center border border-gray-100 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: item.pct }}
                                    className={`h-full ${item.isGoal ? 'bg-emerald-500' : 'bg-emerald-400/80'}`}
                                  />
                                  <span className="absolute left-2.5 text-xs font-mono font-bold text-gray-800">
                                    {item.count} sessions
                                  </span>
                                </div>
                                <span className="w-12 text-right text-xs font-mono font-extrabold text-[#059669]">
                                  {item.pct}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 4. Cohort Retention Heatmap */}
                        {activeConv.chartType === 'retention-grid' && (
                          <div className="space-y-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse border border-gray-150 rounded-lg bg-white overflow-hidden text-xs md:text-sm">
                                <thead>
                                  <tr className="bg-[#FCFCFC] border-b border-gray-150">
                                    <th className="p-3 font-extrabold text-gray-500 uppercase tracking-wide">Cohort</th>
                                    <th className="p-3 font-extrabold text-gray-500 uppercase tracking-wide text-center">W0</th>
                                    <th className="p-3 font-extrabold text-gray-500 uppercase tracking-wide text-center">W1</th>
                                    <th className="p-3 font-extrabold text-gray-500 uppercase tracking-wide text-center">W2</th>
                                    <th className="p-3 font-extrabold text-gray-500 uppercase tracking-wide text-center">W3</th>
                                    <th className="p-3 font-extrabold text-gray-500 uppercase tracking-wide text-center">W4</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[
                                    { name: 'Beta Launch', size: 450, rates: [100, 84, 76, 71, 68] },
                                    { name: 'Feb Cohort', size: 680, rates: [100, 85, 72, 65, 59] },
                                    { name: 'Mar Cohort', size: 910, rates: [100, 81, 68, 62, 54] },
                                    { name: 'Apr Cohort', size: 1250, rates: [100, 78, 65, 58, 51] }
                                  ].map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b border-gray-100">
                                      <td className="p-3 font-extrabold text-gray-950">{row.name} <span className="text-xs text-gray-400 font-mono">({row.size})</span></td>
                                      {row.rates.map((rate, cIdx) => {
                                        let opacityClass = 'bg-emerald-500 text-white';
                                        if (rate < 100) opacityClass = 'bg-emerald-400/80 text-gray-900';
                                        if (rate < 80) opacityClass = 'bg-emerald-300/60 text-gray-900';
                                        if (rate < 70) opacityClass = 'bg-emerald-200/45 text-emerald-950';
                                        if (rate < 60) opacityClass = 'bg-emerald-100/25 text-emerald-950';
                                        return (
                                          <td key={cIdx} className="p-1.5 text-center">
                                            <div className={`py-1.5 rounded font-extrabold text-xs ${opacityClass}`}>
                                              {rate}%
                                            </div>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <span className="text-xs text-gray-400 font-sans block">• Cell density corresponds to user active retention weight.</span>
                          </div>
                        )}

                        {/* 5. User Growth Area Chart */}
                        {activeConv.chartType === 'user-growth' && (
                          <div className="space-y-4">
                            <div className="h-44 flex items-end justify-between border-l border-b border-gray-150 mr-2">
                              {[
                                { m: 'Dec', val: 320, h: 'h-[25%]' },
                                { m: 'Jan', val: 560, h: 'h-[40%]' },
                                { m: 'Feb', val: 810, h: 'h-[55%]' },
                                { m: 'Mar', val: 1240, h: 'h-[70%]' },
                                { m: 'Apr', val: 1890, h: 'h-[85%]' },
                                { m: 'May', val: 2515, h: 'h-full' }
                              ].map((bar, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group relative px-1 h-full justify-end">
                                  <div className="text-xs text-[#059669] font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                                    {bar.val}
                                  </div>
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: bar.val / 11 }} // visual multiplier
                                    className="w-8 rounded-t bg-emerald-500 hover:bg-[#059669] shadow-xs cursor-pointer transition-colors"
                                  />
                                  <span className="text-xs text-gray-400 font-mono font-bold mt-1.5 uppercase select-none">{bar.m}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 6. Churn Stat Details */}
                        {activeConv.chartType === 'churn-stat' && (
                          <div className="grid grid-cols-2 gap-4 select-none pt-2">
                            <div className="border border-gray-100 rounded-xl p-4 bg-slate-50/50">
                              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">Customer Churn</span>
                              <span className="text-3xl font-extrabold text-rose-500 block">1.4%</span>
                              <span className="text-xs text-gray-500 font-sans block mt-1.5">Industrial average is 3.5%</span>
                            </div>
                            <div className="border border-gray-100 rounded-xl p-4 bg-slate-50/50">
                              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">Revenue Churn</span>
                              <span className="text-3xl font-extrabold text-[#059669] block">-0.4%</span>
                              <span className="text-xs text-gray-500 font-sans block mt-1.5">Expansion exceeds churn weight</span>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Divider line inside card */}
                      <div className="border-t border-gray-100 my-4 pt-3.5 flex flex-col sm:flex-row items-center justify-between text-xs select-none text-gray-400 font-mono">
                        
                        {/* Users counts ribbon matching Screenshot 1 */}
                        <div className="flex items-center gap-1.5 mb-1.5 sm:mb-0">
                          <Users className="h-4.5 w-4.5 text-[#059669] shrink-0" />
                          <span className="font-sans font-extrabold text-gray-500">
                            This Week: <strong className="text-gray-950 font-black">1,515 new users</strong> • Last: <strong className="text-gray-950 font-black">1,283</strong>
                          </span>
                        </div>

                        {/* Trend arrows */}
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <span>Increase: 232 users (+18.1%)</span>
                          <span>&uarr;</span>
                        </div>
                      </div>

                      {/* Disclosure disclaimer at bottom of card */}
                      <div className="text-[10px] text-gray-400 text-left pt-1 font-semibold leading-relaxed border-t border-gray-50/50">
                        * Metrics are based on user join date in (UTC).
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Bottom Query Chat Input block */}
              <div className="p-4 border-t border-gray-150 bg-[#FAF9F9]">
                <form onSubmit={handleCustomSubmit} className="flex gap-2.5 relative">
                  <input
                    type="text"
                    value={customQueryInput}
                    onChange={(e) => setCustomQueryInput(e.target.value)}
                    placeholder="Ask tambo any question in plain English (e.g. 'why did revenue drop')"
                    className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-12 py-3 text-sm text-gray-800 placeholder-gray-450 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-sans font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer shadow-sm transition-colors"
                    aria-label="Send query btn"
                    style={{ top: "10px", right: "10px" }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono mt-2 font-bold">
                  <span>⚡ postgres://tambo_admin:*****@db.supabase.co/prod</span>
                  <span>Synthesized in 0.04s</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
