import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Database,
  Download,
  Eye,
  FileText,
  GitBranch,
  Info,
  LayoutDashboard,
  LineChart,
  ListFilter,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Play,
  Plus,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";

type Risk = "Conservative" | "Balanced" | "Growth";
type AgentState = "ready" | "running" | "complete" | "degraded";

type Stock = {
  symbol: string;
  name: string;
  exchange: string;
  price: string;
  move: string;
  moveValue: string;
  tone: "up" | "down" | "flat";
  tag: string;
  watch: boolean;
};

const initialStocks: Stock[] = [
  { symbol: "INFY", name: "Infosys Ltd.", exchange: "NSE", price: "₹1,864.20", move: "+1.84%", moveValue: "+₹33.70", tone: "up", tag: "IT services", watch: true },
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", price: "₹2,941.50", move: "+0.62%", moveValue: "+₹18.10", tone: "up", tag: "Conglomerate", watch: true },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", price: "₹3,812.75", move: "-0.28%", moveValue: "-₹10.70", tone: "down", tag: "IT services", watch: false },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", exchange: "NSE", price: "₹1,742.90", move: "+0.41%", moveValue: "+₹7.05", tone: "up", tag: "Private bank", watch: false },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", exchange: "NSE", price: "₹1,628.30", move: "+2.16%", moveValue: "+₹34.40", tone: "up", tag: "Telecom", watch: false },
  { symbol: "ITC", name: "ITC Ltd.", exchange: "NSE", price: "₹432.60", move: "—", moveValue: "₹0.00", tone: "flat", tag: "Consumer", watch: false },
];

const agentMeta = [
  { id: "technical", label: "Technical", desc: "Trend, momentum & structure", icon: LineChart, color: "teal" },
  { id: "fundamental", label: "Fundamental + RAG", desc: "Earnings, valuation & filings", icon: Database, color: "orange" },
  { id: "sentiment", label: "Sentiment", desc: "News tone & market narrative", icon: Radar, color: "rose" },
] as const;

const traceSteps = [
  { time: "09:41:07", title: "Universe filtered", text: "NSE · large-cap watchlist · ₹1,742.90 last", icon: ListFilter, tone: "neutral" },
  { time: "09:41:09", title: "Signals normalized", text: "3 agents returned scores on a −1 to +1 scale", icon: SlidersHorizontal, tone: "teal" },
  { time: "09:41:11", title: "Risk stance applied", text: "Balanced profile reduced momentum weight by 8%", icon: ShieldCheck, tone: "orange" },
  { time: "09:41:12", title: "Conflict detected", text: "Price structure and news narrative disagree", icon: GitBranch, tone: "rose" },
];

function Shell({ children, page, setPage }: { children: ReactNode; page: string; setPage: (page: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const navItems = [
    { id: "cockpit", label: "Analysis cockpit", icon: LayoutDashboard, href: "/" },
    { id: "activity", label: "Activity & performance", icon: Activity, href: "/activity" },
    { id: "methodology", label: "Architecture & method", icon: GitBranch, href: "/methodology" },
  ];
  return (
    <div className="app-frame">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} data-testid="sidebar-navigation">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span></span><span></span><span></span></div>
          <div>
            <div className="brand-name">Signal<span>Forge</span></div>
            <div className="brand-caption">research cockpit</div>
          </div>
          <button className="icon-btn sidebar-close" onClick={() => setMenuOpen(false)} data-testid="button-close-navigation" aria-label="Close navigation"><PanelLeftClose size={17} /></button>
        </div>
        <div className="desk-status"><span className="live-dot"></span><span>Local demo desk</span><span className="mono">v0.9.4</span></div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <div className="nav-label">Workspace</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href} onClick={() => { setPage(item.id); setMenuOpen(false); }} className={`nav-item ${page === item.id ? "active" : ""}`} data-testid={`link-${item.id}`}>
                <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{page === item.id && <span className="nav-pip"></span>}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-rule"></div>
        <div className="nav-label">Saved context</div>
        <button className="watch-context" onClick={() => { setPage("cockpit"); }} data-testid="button-open-watchlist">
          <div className="context-icon"><Star size={15} fill="currentColor" /></div>
          <div><strong>Core watchlist</strong><small>6 symbols · NSE</small></div>
          <ChevronDown size={15} className="context-chevron" />
        </button>
        <div className="sidebar-bottom">
          <div className="safety-card">
            <ShieldCheck size={16} />
            <div><strong>Safety rail on</strong><small>Signals are research, not advice.</small></div>
          </div>
          <div className="profile-row" data-testid="text-user-profile">
            <div className="avatar">AR</div><div><strong>Arjun Rao</strong><small>Balanced stance</small></div><MoreHorizontal size={17} className="muted-icon" />
          </div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button className="icon-btn menu-toggle" onClick={() => setMenuOpen(true)} data-testid="button-open-navigation" aria-label="Open navigation"><Menu size={20} /></button>
          <div className="crumb"><span>SignalForge</span><span className="crumb-slash">/</span><strong>{page === "cockpit" ? "Analysis cockpit" : page === "activity" ? "Activity & performance" : "Architecture & method"}</strong></div>
          <div className="topbar-actions">
            <span className="market-open"><i></i> NSE live session <span className="mono">09:41 IST</span></span>
            <button className="icon-btn" onClick={() => setNotice("No new desk alerts")} data-testid="button-notifications" aria-label="Notifications"><Bell size={17} /></button>
            <button className="icon-btn" onClick={() => setNotice("Tip: start with your risk stance, then compare the agent evidence")} data-testid="button-help" aria-label="Help"><CircleHelp size={17} /></button>
          </div>
        </header>
        <main className="content-area">{children}</main>
        {notice && <div className="toast-message shell-toast" role="status" data-testid="status-shell-toast"><Check size={14} />{notice}</div>}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Sparkline({ tone = "teal", large = false }: { tone?: "teal" | "orange" | "rose"; large?: boolean }) {
  const points = tone === "rose" ? "0,25 16,21 31,24 47,17 64,19 80,11 98,15 115,8 133,12 149,3 166,7 184,2" : tone === "orange" ? "0,25 17,20 31,22 47,16 64,19 81,12 96,14 113,6 132,10 148,6 166,8 184,2" : "0,26 16,22 31,23 47,14 64,17 80,10 97,12 115,7 132,8 149,3 166,6 184,1";
  return <svg className={`sparkline ${large ? "sparkline-large" : ""}`} viewBox="0 0 184 30" preserveAspectRatio="none" aria-hidden="true"><path className={`spark-fill ${tone}`} d={`M0,30 L${points} L184,30 Z`} /><polyline className={`spark-line ${tone}`} points={points} /></svg>;
}

function StockRow({ stock, selected, onSelect, onToggleWatch }: { stock: Stock; selected: boolean; onSelect: () => void; onToggleWatch: () => void }) {
  return (
    <div className={`stock-row ${selected ? "selected" : ""}`} data-testid={`row-stock-${stock.symbol}`}>
      <button className="stock-main" onClick={onSelect} data-testid={`button-select-stock-${stock.symbol}`}>
        <span className={`ticker-badge ticker-${stock.symbol.toLowerCase().slice(0, 2)}`}>{stock.symbol.slice(0, 2)}</span>
        <span className="stock-name"><strong>{stock.symbol}</strong><small>{stock.name}</small></span>
      </button>
      <span className="stock-tag">{stock.tag}</span>
      <span className="stock-price">{stock.price}<small>{stock.exchange}</small></span>
      <span className={`stock-move ${stock.tone}`}><span>{stock.tone === "up" ? <TrendingUp size={13} /> : stock.tone === "down" ? <TrendingDown size={13} /> : null}{stock.move}</span><small>{stock.moveValue}</small></span>
      <button className={`star-btn ${stock.watch ? "starred" : ""}`} onClick={onToggleWatch} data-testid={`button-toggle-watch-${stock.symbol}`} aria-label={`${stock.watch ? "Remove" : "Add"} ${stock.symbol} ${stock.watch ? "from" : "to"} watchlist`}><Star size={16} fill={stock.watch ? "currentColor" : "none"} /></button>
    </div>
  );
}

function AgentCard({ agent, state, score, onRetry }: { agent: typeof agentMeta[number]; state: AgentState; score: string; onRetry: () => void }) {
  const Icon = agent.icon;
  const isRunning = state === "running";
  return (
    <div className={`agent-card ${state}`} data-testid={`card-agent-${agent.id}`}>
      <div className="agent-top"><div className={`agent-icon ${agent.color}`}><Icon size={18} /></div><div className="agent-title"><strong>{agent.label}</strong><small>{agent.desc}</small></div><span className={`agent-state-dot ${state}`}></span></div>
      <div className="agent-progress"><span style={{ width: state === "complete" || state === "degraded" ? "100%" : isRunning ? "66%" : "12%" }}></span></div>
      <div className="agent-bottom">{state === "complete" && <><span className="agent-status"><Check size={13} /> Complete</span><strong className="agent-score">{score}</strong></>}{state === "running" && <><span className="agent-status running-status"><span className="mini-pulse"></span> Processing</span><span className="mono">14.2s</span></>}{state === "degraded" && <><span className="agent-status degraded-status"><Info size={13} /> Partial data</span><button className="text-btn" onClick={onRetry} data-testid={`button-retry-agent-${agent.id}`}>Retry</button></>}{state === "ready" && <span className="agent-status muted-status">Queued</span>}</div>
    </div>
  );
}

function RiskSelector({ risk, setRisk }: { risk: Risk; setRisk: (risk: Risk) => void }) {
  const choices: { id: Risk; desc: string; weight: string }[] = [
    { id: "Conservative", desc: "Protect downside first", weight: "Capital 60%" },
    { id: "Balanced", desc: "Evidence over urgency", weight: "Signal 50%" },
    { id: "Growth", desc: "Accept measured volatility", weight: "Momentum 45%" },
  ];
  return <div className="risk-selector" data-testid="control-risk-stance">{choices.map((choice) => <button key={choice.id} className={`risk-choice ${risk === choice.id ? "active" : ""}`} onClick={() => setRisk(choice.id)} data-testid={`button-risk-${choice.id.toLowerCase()}`}><span className="risk-radio">{risk === choice.id && <i></i>}</span><span><strong>{choice.id}</strong><small>{choice.desc}</small></span><em>{choice.weight}</em></button>)}</div>;
}

function Cockpit({ stocks, setStocks, risk, setRisk }: { stocks: Stock[]; setStocks: (stocks: Stock[]) => void; risk: Risk; setRisk: (risk: Risk) => void }) {
  const [selected, setSelected] = useState("HDFCBANK");
  const [query, setQuery] = useState("");
  const [analysisState, setAnalysisState] = useState<"idle" | "running" | "complete">("idle");
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({ technical: "complete", fundamental: "complete", sentiment: "degraded" });
  const [traceOpen, setTraceOpen] = useState(true);
  const [toast, setToast] = useState("");
  const selectedStock = stocks.find((stock) => stock.symbol === selected) ?? stocks[0];
  const filteredStocks = stocks.filter((stock) => `${stock.symbol} ${stock.name}`.toLowerCase().includes(query.toLowerCase()));
  const scores = { technical: "+0.71", fundamental: "+0.54", sentiment: "-0.18" };
  const isRunning = analysisState === "running";
  const runAnalysis = () => {
    setAnalysisState("running");
    setAgentStates({ technical: "running", fundamental: "running", sentiment: "running" });
    setToast("Analysis run started · 3 agents are working in parallel");
    window.setTimeout(() => { setAgentStates({ technical: "complete", fundamental: "complete", sentiment: "degraded" }); setAnalysisState("complete"); setToast("Analysis complete · conflicting sentiment safely disclosed"); }, 1600);
  };
  const retrySentiment = () => { setAgentStates((current) => ({ ...current, sentiment: "running" })); setToast("Refreshing sentiment sources…"); window.setTimeout(() => { setAgentStates((current) => ({ ...current, sentiment: "degraded" })); setToast("One source remains delayed · fallback evidence retained"); }, 1100); };
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2800); return () => window.clearTimeout(timer); }, [toast]);
  const finalLabel = risk === "Growth" ? "WATCH / BUILD" : "HOLD / OBSERVE";
  return (
    <div className="page-enter">
      <SectionHeading eyebrow="Decision workspace · 01" title="Analysis cockpit" description="Turn a market question into an auditable signal in under 60 seconds." action={<button className="quiet-button" onClick={() => setToast("A clean local session has been prepared")} data-testid="button-new-session"><Plus size={16} /> New session</button>} />
      <div className="market-strip" data-testid="status-market-session"><div><span className="strip-label">NIFTY 50</span><strong>22,957.10</strong><span className="positive">+0.78%</span></div><div><span className="strip-label">SENSEX</span><strong>75,901.41</strong><span className="positive">+0.65%</span></div><div><span className="strip-label">USD / INR</span><strong>83.62</strong><span className="negative">−0.12%</span></div><div className="market-strip-note"><Clock3 size={14} /> Data as of 09:40:48 IST · delayed by 15 min</div></div>
      <div className="cockpit-grid">
        <section className="panel setup-panel">
          <div className="panel-title"><div><span className="step-index">01</span><h2>Set your lens</h2></div><span className="saved-label"><Check size={13} /> Saved locally</span></div>
          <div className="field-label">Risk stance <button className="help-dot" data-testid="button-risk-help" aria-label="Risk stance help"><Info size={12} /></button></div>
          <RiskSelector risk={risk} setRisk={setRisk} />
          <div className="field-label stock-field-label">Choose an instrument <span className="field-hint">Watchlist · NSE</span></div>
          <div className="stock-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search symbol or company" data-testid="input-stock-search" /></div>
          <div className="stock-list">{filteredStocks.map((stock) => <StockRow key={stock.symbol} stock={stock} selected={selected === stock.symbol} onSelect={() => { setSelected(stock.symbol); setToast(`${stock.symbol} selected for analysis`); }} onToggleWatch={() => { setStocks(stocks.map((item) => item.symbol === stock.symbol ? { ...item, watch: !item.watch } : item)); setToast(`${stock.symbol} ${stock.watch ? "removed from" : "added to"} watchlist`); }} />)}</div>
          <button className="add-watchlist" onClick={() => setToast("Watchlist editor is available in your local session")} data-testid="button-add-watchlist"><Plus size={14} /> Add symbol to watchlist</button>
          <div className="portfolio-snapshot" data-testid="card-portfolio-snapshot"><div><span>Portfolio pulse</span><strong>₹8,42,600</strong><small>4 positions · invested view</small></div><div className="portfolio-return"><span>Today</span><strong>+₹6,842</strong><small>+0.82%</small></div></div>
        </section>
        <section className="panel run-panel">
          <div className="panel-title"><div><span className="step-index">02</span><h2>Run the forge</h2></div><span className="mono session-id">SF-2408-019</span></div>
          <div className="selected-instrument"><div className="company-token">{selectedStock.symbol.slice(0, 2)}</div><div><span>Selected instrument</span><strong>{selectedStock.symbol} <small>{selectedStock.name}</small></strong></div><span className="selected-price">{selectedStock.price}<small className={selectedStock.tone}>{selectedStock.move}</small></span></div>
          <div className="agent-stack">{agentMeta.map((agent) => <AgentCard key={agent.id} agent={agent} state={agentStates[agent.id]} score={scores[agent.id as keyof typeof scores]} onRetry={retrySentiment} />)}</div>
          <button className={`run-button ${isRunning ? "is-running" : ""}`} onClick={runAnalysis} disabled={isRunning} data-testid="button-run-analysis">{isRunning ? <><RefreshCw size={17} className="spin" /> Agents are comparing evidence…</> : <><Play size={16} fill="currentColor" /> {analysisState === "complete" ? "Run again" : "Run analysis"} <span className="run-shortcut">⌘ ↵</span></>}</button>
          <div className="run-caption"><Zap size={13} /> Parallel run · local deterministic demo · no orders placed</div>
        </section>
        <section className="panel signal-panel">
          <div className="panel-title"><div><span className="step-index">03</span><h2>Signal synthesis</h2></div><button className="icon-btn" onClick={() => setTraceOpen(!traceOpen)} data-testid="button-toggle-trace" aria-label="Toggle trace"><Eye size={16} /></button></div>
          <div className="signal-hero" data-testid="status-final-signal"><div className="signal-kicker">Current signal <span className="cited-pill"><ShieldCheck size={12} /> risk-aware</span></div><div className="signal-word">{isRunning ? "WORKING" : finalLabel.split(" / ")[0]}</div><div className="signal-sub">{isRunning ? "Waiting for all agent outputs" : "Evidence is mixed; patience has the edge."}</div><div className="confidence-row"><span>Confidence</span><strong>{isRunning ? "—" : "63"}<small>/100</small></strong></div><div className="confidence-bar"><span style={{ width: isRunning ? "18%" : "63%" }}></span></div></div>
          <div className="weight-row"><span>Risk stance weighting</span><strong>{risk}</strong></div><div className="weight-bars"><div><span>Technical</span><i><b style={{ width: risk === "Growth" ? "42%" : "34%" }}></b></i><em>{risk === "Growth" ? "42%" : "34%"}</em></div><div><span>Fundamental</span><i><b className="teal-bar" style={{ width: risk === "Conservative" ? "42%" : "50%" }}></b></i><em>{risk === "Conservative" ? "42%" : "50%"}</em></div><div><span>Sentiment</span><i><b className="rose-bar" style={{ width: "16%" }}></b></i><em>16%</em></div></div>
          <div className="reasoning-box"><div className="box-label"><BrainCircuit size={14} /> Why this signal</div><p>Price structure remains constructive, while the latest narrative is noisy. Fundamentals support staying engaged, but the sentiment gap lowers conviction.</p><button className="inline-link" onClick={() => setTraceOpen(true)} data-testid="button-open-reasoning">View reasoning trace <ArrowRight size={14} /></button></div>
          <div className="safety-note"><ShieldCheck size={15} /><span><strong>Safe by design</strong> This is an explainable research output, not financial advice.</span></div>
        </section>
      </div>
      <div className={`lower-grid ${traceOpen ? "" : "trace-collapsed"}`}>
        <section className="panel trace-panel">
          <div className="panel-title"><div><span className="step-index">04</span><h2>Evidence trace</h2></div><span className="mono">12.8s total</span></div>
          <div className="trace-list">{traceSteps.map((step, index) => { const Icon = step.icon; return <div className={`trace-item ${step.tone}`} key={step.title}><div className="trace-rail"><span className="trace-node"><Icon size={13} /></span>{index < traceSteps.length - 1 && <i></i>}</div><div className="trace-copy"><div><strong>{step.title}</strong><time>{step.time}</time></div><p>{step.text}</p></div></div>; })}</div>
          <button className="trace-footer" onClick={() => setToast("Full trace export prepared locally")} data-testid="button-export-trace"><Download size={14} /> Export trace <span className="mono">JSON</span></button>
        </section>
        <section className="panel sources-panel">
          <div className="panel-title"><div><span className="step-index">05</span><h2>Source ledger</h2></div><span className="source-count">8 cited</span></div>
          <div className="source-list"><div className="source-row"><span className="source-favicon">N</span><div><strong>NSE India</strong><small>Price & volume · 09:40 IST</small></div><span className="source-ok"><Check size={12} /> fresh</span></div><div className="source-row"><span className="source-favicon filing">F</span><div><strong>HDFC Bank · Q4 filing</strong><small>Fundamentals · 28 Apr 2024</small></div><span className="source-ok"><Check size={12} /> cited</span></div><div className="source-row"><span className="source-favicon press">P</span><div><strong>Reuters India</strong><small>Sentiment · 07 May 2024</small></div><span className="source-delay"><Clock3 size={12} /> delayed</span></div></div>
          <button className="source-footer" onClick={() => setToast("Source ledger is already pinned to this session")} data-testid="button-view-all-sources">View all sources <ArrowRight size={14} /></button>
        </section>
      </div>
      {toast && <div className="toast-message" role="status" data-testid="status-toast"><Check size={14} />{toast}</div>}
    </div>
  );
}

function ActivityPage() {
  const [notice, setNotice] = useState("");
  const [range, setRange] = useState("Last 30 days");
  const rows = [
    { symbol: "INFY", signal: "ACCUMULATE", confidence: "71", outcome: "+4.8%", date: "08 May · 09:12", tone: "positive" },
    { symbol: "HDFCBANK", signal: "HOLD / OBSERVE", confidence: "63", outcome: "Open", date: "07 May · 14:38", tone: "neutral" },
    { symbol: "TCS", signal: "WATCH / BUILD", confidence: "58", outcome: "+1.2%", date: "06 May · 10:03", tone: "positive" },
    { symbol: "RELIANCE", signal: "REDUCE", confidence: "76", outcome: "−2.1%", date: "03 May · 11:46", tone: "negative" },
  ];
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);
  return <div className="page-enter"><SectionHeading eyebrow="Decision workspace · 02" title="Activity & performance" description="A sober record of what the desk saw, said, and learned." action={<button className="quiet-button" onClick={() => setNotice("Performance snapshot exported to this local session")} data-testid="button-export-performance"><Download size={15} /> Export session</button>} /><div className="metrics-grid"><div className="metric-card"><span>Runs this week</span><strong>24</strong><small className="positive">+6 vs last week</small><Sparkline tone="teal" /></div><div className="metric-card"><span>Average confidence</span><strong>68.4<small>/100</small></strong><small className="positive">+3.2 pts</small><Sparkline tone="orange" /></div><div className="metric-card"><span>Evidence conflicts</span><strong>17<small>%</small></strong><small className="neutral-copy">4 flagged for review</small><Sparkline tone="rose" /></div><div className="metric-card"><span>Source freshness</span><strong>91<small>%</small></strong><small className="positive">Within target</small><Sparkline tone="teal" /></div></div><div className="activity-grid"><section className="panel history-panel"><div className="panel-title"><div><span className="step-index">LOG</span><h2>Signal history</h2></div><button className="filter-button" onClick={() => setRange(range === "Last 30 days" ? "Last 7 days" : "Last 30 days")} data-testid="button-filter-history"><ListFilter size={14} /> {range} <ChevronDown size={13} /></button></div><div className="history-table"><div className="table-head"><span>Instrument</span><span>Signal</span><span>Confidence</span><span>Observed outcome</span><span>Timestamp</span></div>{rows.map((row) => <div className="history-row" key={row.symbol}><div><span className="ticker-badge small">{row.symbol.slice(0, 2)}</span><strong>{row.symbol}</strong></div><span className={`signal-pill ${row.tone}`}>{row.signal}</span><span className="confidence-cell"><i><b style={{ width: `${row.confidence}%` }}></b></i>{row.confidence}</span><strong className={row.outcome.startsWith("−") ? "negative" : row.outcome === "Open" ? "neutral-copy" : "positive"}>{row.outcome}</strong><time>{row.date}</time></div>)}</div></section><section className="panel learning-panel"><div className="panel-title"><div><span className="step-index">NOTE</span><h2>Desk learning</h2></div><Sparkles size={16} className="orange-icon" /></div><div className="learning-highlight"><span>Pattern noticed</span><strong>Conflicting sentiment is more common after earnings</strong><p>4 of 6 recent conflicts appeared within 48 hours of a filing. Treat narrative shifts as lower-confidence until the next price session confirms.</p></div><div className="mini-stat-row"><div><small>Best aligned agent</small><strong>Fundamental</strong><span>76% directional match</span></div><div><small>Most reviewed</small><strong>Sentiment</strong><span>9 human checks</span></div></div><button className="inline-link" onClick={() => setNotice("Methodology notes are one click away in the navigation")} data-testid="button-open-methodology">Read methodology notes <ArrowRight size={14} /></button></section></div>{notice && <div className="toast-message" role="status" data-testid="status-activity-toast"><Check size={14} />{notice}</div>}</div>;
}

function MethodologyPage() {
  const [open, setOpen] = useState("orchestration");
  const items = [
    { id: "orchestration", n: "01", title: "Orchestration layer", text: "The desk receives a symbol, a risk stance, and a timestamped market context. It fans the question out to independent agents so one narrative cannot dominate the first pass." },
    { id: "agents", n: "02", title: "Three evidence agents", text: "Technical reads price structure and momentum. Fundamental + RAG grounds ratios and filings. Sentiment classifies recent narrative with source freshness attached." },
    { id: "risk", n: "03", title: "Risk-aware weighting", text: "Your stance changes the weighting, not the facts. Conservative profiles reward durable evidence; Growth profiles tolerate more momentum. We always show the math." },
    { id: "synthesis", n: "04", title: "Synthesis & safety rail", text: "The synthesis agent writes a plain-language conclusion, reduces confidence when signals conflict, and never turns a research output into a trade instruction." },
  ];
  return <div className="page-enter"><SectionHeading eyebrow="Decision workspace · 03" title="Architecture & method" description="A visible reasoning chain for people who want to know what sits beneath a signal." action={<button className="quiet-button" onClick={() => setOpen("orchestration")} data-testid="button-reset-method"><RefreshCw size={15} /> Reset view</button>} /><div className="architecture-layout"><section className="panel architecture-panel"><div className="architecture-map"><div className="map-node input-node"><UserRound size={18} /><strong>Investor lens</strong><small>Profile + risk stance</small></div><div className="map-line"><span></span><span></span><span></span></div><div className="map-node central-node"><BrainCircuit size={21} /><strong>SignalForge</strong><small>Orchestrate · normalize</small></div><div className="map-line"><span></span><span></span><span></span></div><div className="map-agents"><div><LineChart size={15} /><span>Technical</span></div><div><Database size={15} /><span>Fundamental</span></div><div><Radar size={15} /><span>Sentiment</span></div></div><div className="map-line vertical"><span></span><span></span></div><div className="map-node output-node"><Target size={18} /><strong>Explainable signal</strong><small>Confidence · caveats · sources</small></div></div><div className="architecture-foot"><span><span className="live-dot"></span> Deterministic local demo</span><span className="mono">inputs → evidence → decision</span></div></section><section className="panel method-list-panel"><div className="panel-title"><div><span className="step-index">READ</span><h2>How it reasons</h2></div><BookOpen size={16} className="teal-icon" /></div><div className="method-list">{items.map((item) => <button key={item.id} className={`method-item ${open === item.id ? "open" : ""}`} onClick={() => setOpen(open === item.id ? "" : item.id)} data-testid={`button-method-${item.id}`}><div className="method-title"><span>{item.n}</span><strong>{item.title}</strong><ChevronDown size={15} /></div>{open === item.id && <p>{item.text}</p>}</button>)}</div></section></div><div className="method-callout"><ShieldCheck size={17} /><div><strong>Built for informed curiosity</strong><p>SignalForge is a research interface and educational demo. It does not know your circumstances, it cannot predict markets, and it should not be used as financial advice.</p></div><button className="inline-link" onClick={() => setOpen("synthesis")} data-testid="button-view-safety"><ArrowRight size={14} /></button></div></div>;
}

function App() {
  const [location, setLocation] = useLocation();
  const [stocks, setStocks] = useState<Stock[]>(() => { try { const saved = localStorage.getItem("signalforge-stocks"); return saved ? JSON.parse(saved) : initialStocks; } catch { return initialStocks; } });
  const [risk, setRisk] = useState<Risk>(() => (localStorage.getItem("signalforge-risk") as Risk) || "Balanced");
  useEffect(() => { localStorage.setItem("signalforge-stocks", JSON.stringify(stocks)); }, [stocks]);
  useEffect(() => { localStorage.setItem("signalforge-risk", risk); }, [risk]);
  const page = location === "/activity" ? "activity" : location === "/methodology" ? "methodology" : "cockpit";
  const setPage = (next: string) => setLocation(next === "cockpit" ? "/" : `/${next}`);
  return <Shell page={page} setPage={setPage}>{page === "cockpit" ? <Cockpit stocks={stocks} setStocks={setStocks} risk={risk} setRisk={setRisk} /> : page === "activity" ? <ActivityPage /> : <MethodologyPage />}</Shell>;
}

export default App;
