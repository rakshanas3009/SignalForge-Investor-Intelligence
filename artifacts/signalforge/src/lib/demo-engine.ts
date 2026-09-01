export type Signal = "BULLISH" | "NEUTRAL" | "BEARISH";
export type RiskProfile = "Conservative" | "Moderate" | "Aggressive";
export type IssueMode =
  | "none"
  | "missing-filing"
  | "market-unavailable"
  | "news-unavailable"
  | "conflict";
export type AgentKey = "technical" | "fundamental" | "sentiment";

export type MarketInput = {
  symbol: string;
  name: string;
  price: number;
  dailyChange: number;
  volume: number;
  averageVolume: number;
  rsi: number;
  movingAverage: number;
  momentum: number;
  volatility: number;
  sentimentScore: number;
  timestamp: string;
  sourceMode: "SIMULATED DEMO DATA";
};

export type EvidenceSource = {
  id: string;
  documentName: string;
  source: string;
  section: string;
  excerpt: string;
  relevance: number;
  retrievedAt: string;
};

export type DimensionResult = {
  dimension:
    | "PRICE / MOMENTUM"
    | "VOLUME / ACTIVITY"
    | "FUNDAMENTAL / EVIDENCE"
    | "SENTIMENT";
  signal: Signal;
  confidence: number;
  reasoning: string;
  timestamp: string;
  metrics: Record<string, string>;
  score: number;
  status: "available" | "partial" | "unavailable";
  sources: EvidenceSource[];
};

export type AgentResult = {
  agent: AgentKey;
  signal: Signal;
  confidence: number;
  reasoning: string;
  timestamp: string;
  metrics: Record<string, string>;
  sources: EvidenceSource[];
  evidence: EvidenceSource[];
  sentimentScore?: number;
  status: "available" | "partial" | "unavailable";
  dimensions: DimensionResult[];
};

export type SynthesisResult = {
  overallSignal: Signal;
  displaySignal: "BULLISH" | "NEUTRAL" | "BEARISH" | "WATCH / CAUTION";
  confidence: number;
  reasoning: string;
  keyRisks: string[];
  opportunities: string[];
  supportingEvidence: EvidenceSource[];
  personalizedInterpretation: string;
  weights: Record<string, number>;
};

export type SessionMetrics = {
  sessionId: string;
  timestamp: string;
  symbol: string;
  technicalLatencyMs: number;
  fundamentalLatencyMs: number;
  sentimentLatencyMs: number;
  synthesisLatencyMs: number;
  totalAnalysisMs: number;
  retrievedDocuments: number;
  retrievalRelevance: number;
  confidence: number;
  portfolioConcentration: number;
  demoBacktestAccuracy: number;
  accuracyLabel: "DEMO / BACKTEST";
  status: "complete" | "partial";
};

export type OrchestratorResult = {
  input: MarketInput;
  technical: AgentResult;
  fundamental: AgentResult;
  sentiment: AgentResult;
  dimensions: DimensionResult[];
  synthesis: SynthesisResult;
  metrics: SessionMetrics;
  issueMode: IssueMode;
};

const now = () => new Date().toISOString();
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const signalForScore = (score: number): Signal =>
  score > 0.2 ? "BULLISH" : score < -0.2 ? "BEARISH" : "NEUTRAL";

const confidenceForScore = (score: number, penalty = 0) =>
  Math.round(clamp(54 + Math.abs(score) * 35 - penalty, 20, 94));

const tokenise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token.length > 2);

export const documentCorpus: EvidenceSource[] = [
  {
    id: "doc-hdfc-q4",
    documentName: "HDFC Bank Q4 FY24 filing",
    source: "BSE India / Filing",
    section: "Page 8 · Financial performance",
    excerpt:
      "Net interest income grew 24.4% year over year; asset quality remains stable in the reported quarter.",
    relevance: 0,
    retrievedAt: "",
  },
  {
    id: "doc-hdfc-ir",
    documentName: "HDFC Bank investor presentation",
    source: "Company IR",
    section: "Slide 14 · Deposits & distribution",
    excerpt:
      "Management outlines a measured deposit growth plan and continued investment in digital distribution.",
    relevance: 0,
    retrievedAt: "",
  },
  {
    id: "doc-rates",
    documentName: "Rate outlook coverage",
    source: "Reuters India · simulated archive",
    section: "Market context",
    excerpt:
      "Traders weigh sticky inflation against the prospect of a stable rate environment.",
    relevance: 0,
    retrievedAt: "",
  },
  {
    id: "doc-volume",
    documentName: "NSE volume snapshot",
    source: "NSE India · simulated observation",
    section: "Market activity · 09:40 IST",
    excerpt:
      "Volume is 1.14x the 20-day average at the latest simulated observation.",
    relevance: 0,
    retrievedAt: "",
  },
];

export function retrieveEvidence(query: string, issueMode: IssueMode = "none") {
  if (issueMode === "missing-filing") return [];
  const queryTokens = new Set(tokenise(query));
  const ranked = documentCorpus
    .map((document) => {
      const corpusTokens = new Set(
        tokenise(
          `${document.documentName} ${document.section} ${document.excerpt}`,
        ),
      );
      const overlap = [...queryTokens].filter((token) =>
        corpusTokens.has(token),
      ).length;
      return {
        ...document,
        relevance: clamp(48 + overlap * 11, 48, 97),
        retrievedAt: now(),
      };
    })
    .filter((document) => document.relevance > 48)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
  return ranked;
}

export function toMarketInput(stock: {
  symbol: string;
  name: string;
  price: number;
  move: number;
  volume: string;
}): MarketInput {
  const volume = Number.parseFloat(stock.volume) || 1;
  const averageVolume = volume / 1.14;
  const rsi = stock.move > 1 ? 63.4 : stock.move < 0 ? 47.8 : 58.6;
  return {
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    dailyChange: stock.move,
    volume,
    averageVolume,
    rsi,
    movingAverage: stock.price * 0.985,
    momentum: stock.move > 0 ? 0.42 : -0.18,
    volatility: stock.move < 0 ? 1.62 : 1.28,
    sentimentScore: stock.symbol === "TCS" ? -0.34 : -0.18,
    timestamp: now(),
    sourceMode: "SIMULATED DEMO DATA",
  };
}

function buildTechnicalAgent(
  input: MarketInput,
  issueMode: IssueMode,
): AgentResult {
  const priceScore =
    (input.dailyChange > 0 ? 0.3 : -0.3) +
    (input.price > input.movingAverage ? 0.28 : -0.28) +
    (input.rsi > 50 ? 0.16 : -0.16) +
    input.momentum * 0.25;
  const priceScoreClamped = clamp(priceScore, -1, 1);
  const priceStatus = issueMode === "market-unavailable" ? "partial" : "available";
  const pricePenalty = issueMode === "market-unavailable" ? 22 : 0;
  const priceMomentum: DimensionResult = {
    dimension: "PRICE / MOMENTUM",
    signal: signalForScore(priceScoreClamped),
    confidence: confidenceForScore(priceScoreClamped, pricePenalty),
    reasoning:
      issueMode === "market-unavailable"
        ? "Market feed unavailable; the last successful simulated snapshot is retained and clearly marked stale."
        : `Price is ${input.price > input.movingAverage ? "above" : "below"} the 20-day average with ${input.momentum > 0 ? "constructive" : "soft"} momentum.`,
    timestamp: input.timestamp,
    metrics: {
      "Daily change": `${input.dailyChange >= 0 ? "+" : ""}${input.dailyChange.toFixed(2)}%`,
      RSI: input.rsi.toFixed(1),
      "MA 20": `₹${input.movingAverage.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
      Momentum: input.momentum.toFixed(2),
    },
    score: priceScoreClamped,
    status: priceStatus,
    sources: [],
  };
  const volumeRatio = input.volume / input.averageVolume;
  const volumeScore = clamp((volumeRatio - 1) * 1.7 + (input.volatility < 1.8 ? 0.12 : -0.12), -1, 1);
  const volumeDimension: DimensionResult = {
    dimension: "VOLUME / ACTIVITY",
    signal: signalForScore(volumeScore),
    confidence: confidenceForScore(volumeScore, issueMode === "market-unavailable" ? 22 : 0),
    reasoning:
      issueMode === "market-unavailable"
        ? "Volume feed unavailable; activity classification is partial and confidence is reduced."
        : `Volume is ${volumeRatio.toFixed(2)}x the 20-day average with ${input.volatility.toFixed(2)}% observed volatility.`,
    timestamp: input.timestamp,
    metrics: {
      Volume: `${input.volume.toFixed(1)}M`,
      "20D average": `${input.averageVolume.toFixed(1)}M`,
      "Volume anomaly": `${((volumeRatio - 1) * 100).toFixed(0)}%`,
      Volatility: `${input.volatility.toFixed(2)}%`,
    },
    score: volumeScore,
    status: priceStatus,
    sources: [],
  };
  return {
    agent: "technical",
    signal: priceMomentum.signal,
    confidence: priceMomentum.confidence,
    reasoning: priceMomentum.reasoning,
    timestamp: input.timestamp,
    metrics: { ...priceMomentum.metrics, ...volumeDimension.metrics },
    sources: [],
    evidence: [],
    status: priceStatus,
    dimensions: [priceMomentum, volumeDimension],
  };
}

function buildFundamentalAgent(
  input: MarketInput,
  issueMode: IssueMode,
): AgentResult {
  const sources = retrieveEvidence(
    `${input.symbol} earnings asset quality deposit growth filing`,
    issueMode,
  );
  const unavailable = issueMode === "missing-filing";
  const score = unavailable ? 0 : sources.length ? 0.54 : 0.12;
  return {
    agent: "fundamental",
    signal: signalForScore(score),
    confidence: unavailable ? 22 : confidenceForScore(score),
    reasoning: unavailable
      ? "Fundamental evidence unavailable. No document-specific claim is generated until a filing can be retrieved."
      : "Retrieved filing context supports earnings durability and stable asset quality; valuation remains a watch item.",
    timestamp: input.timestamp,
    metrics: {
      "Retrieved chunks": String(sources.length),
      "Average relevance": sources.length
        ? `${Math.round(sources.reduce((sum, source) => sum + source.relevance, 0) / sources.length)}%`
        : "—",
      "Claims grounded": unavailable ? "0" : "2",
    },
    sources,
    evidence: sources,
    status: unavailable ? "unavailable" : "available",
    dimensions: [
      {
        dimension: "FUNDAMENTAL / EVIDENCE",
        signal: signalForScore(score),
        confidence: unavailable ? 22 : confidenceForScore(score),
        reasoning: unavailable
          ? "No filing was retrieved; the fundamental dimension is unavailable."
          : "Filing context provides a constructive fundamental read.",
        timestamp: input.timestamp,
        metrics: { "Evidence chunks": String(sources.length) },
        score,
        status: unavailable ? "unavailable" : "available",
        sources,
      },
    ],
  };
}

function buildSentimentAgent(
  input: MarketInput,
  issueMode: IssueMode,
): AgentResult {
  const unavailable = issueMode === "news-unavailable";
  const score = issueMode === "conflict" ? -0.62 : input.sentimentScore;
  const sources = unavailable ? [] : retrieveEvidence("rate outlook market narrative", "none");
  const sentimentDimension: DimensionResult = {
    dimension: "SENTIMENT",
    signal: signalForScore(score),
    confidence: unavailable ? 20 : confidenceForScore(score, issueMode === "conflict" ? 8 : 0),
    reasoning: unavailable
      ? "News feed unavailable. Sentiment is marked partial instead of being filled with an invented story."
      : `Recent narrative is ${score < -0.2 ? "negative" : score > 0.2 ? "positive" : "neutral"} around rates and macro uncertainty.`,
    timestamp: input.timestamp,
    metrics: {
      "Sentiment score": score.toFixed(2),
      "News items": unavailable ? "0" : "5",
      "Key themes": "Rates · macro · demand",
    },
    score,
    status: unavailable ? "unavailable" : issueMode === "conflict" ? "partial" : "available",
    sources,
  };
  return {
    agent: "sentiment",
    signal: sentimentDimension.signal,
    confidence: sentimentDimension.confidence,
    reasoning: sentimentDimension.reasoning,
    timestamp: input.timestamp,
    metrics: sentimentDimension.metrics,
    sources,
    evidence: sources,
    sentimentScore: score,
    status: sentimentDimension.status,
    dimensions: [sentimentDimension],
  };
}

function riskWeights(risk: RiskProfile) {
  if (risk === "Conservative") {
    return { technical: 0.22, volume: 0.14, fundamental: 0.42, sentiment: 0.22 };
  }
  if (risk === "Aggressive") {
    return { technical: 0.38, volume: 0.26, fundamental: 0.2, sentiment: 0.16 };
  }
  return { technical: 0.3, volume: 0.2, fundamental: 0.3, sentiment: 0.2 };
}

export function synthesize(
  input: MarketInput,
  technical: AgentResult,
  fundamental: AgentResult,
  sentiment: AgentResult,
  risk: RiskProfile,
  portfolioConcentration: number,
): SynthesisResult {
  const weights = riskWeights(risk);
  const price = technical.dimensions.find((item) => item.dimension === "PRICE / MOMENTUM")?.score ?? 0;
  const volume = technical.dimensions.find((item) => item.dimension === "VOLUME / ACTIVITY")?.score ?? 0;
  const fundamentalScore = fundamental.dimensions[0]?.score ?? 0;
  const sentimentScore = sentiment.dimensions[0]?.score ?? 0;
  const score =
    price * weights.technical +
    volume * weights.volume +
    fundamentalScore * weights.fundamental +
    sentimentScore * weights.sentiment;
  const hasConflict =
    [technical.signal, fundamental.signal, sentiment.signal].filter((signal) => signal === "BEARISH").length > 0 &&
    [technical.signal, fundamental.signal, sentiment.signal].filter((signal) => signal === "BULLISH").length > 0;
  const missingEvidence = fundamental.status !== "available";
  const confidencePenalty =
    (hasConflict ? 7 : 0) +
    (missingEvidence ? 20 : 0) +
    (sentiment.status !== "available" ? 10 : 0) +
    (portfolioConcentration > 40 ? 4 : 0);
  const baseConfidence = Math.round(
    (technical.confidence + fundamental.confidence + sentiment.confidence) / 3,
  );
  const confidence = clamp(baseConfidence - confidencePenalty, 18, 92);
  const overallSignal = signalForScore(score);
  const displaySignal =
    hasConflict || confidence < 46 ? "WATCH / CAUTION" : overallSignal;
  const riskLabel =
    risk === "Conservative"
      ? "downside protection"
      : risk === "Aggressive"
        ? "measured participation"
        : "evidence-led patience";
  return {
    overallSignal,
    displaySignal,
    confidence,
    reasoning: missingEvidence
      ? `The ${riskLabel} lens keeps the market read visible, but the missing filing prevents a fully grounded fundamental conclusion. Confidence is reduced and no document claim is made.`
      : `Price structure and fundamentals lean ${overallSignal.toLowerCase()}, while sentiment ${sentimentScore < 0 ? "pulls the other way" : "confirms the direction"}. The ${riskLabel} lens sets the final interpretation without changing the raw market input.`,
    keyRisks: [
      hasConflict ? "Agent disagreement between market structure and narrative." : "Narrative can change faster than the underlying filing.",
      portfolioConcentration > 40 ? "Portfolio exposure is above the 40% concentration guardrail." : "No concentration breach detected in the local ledger.",
      missingEvidence ? "Fundamental filing is unavailable for this run." : "Valuation requires a fresh review before any decision.",
    ],
    opportunities: [
      "Price remains above the simulated moving average.",
      fundamental.status === "available" ? "Retrieved filing context supports durable earnings." : "Retry the filing retrieval to restore grounding.",
    ],
    supportingEvidence: fundamental.evidence,
    personalizedInterpretation:
      risk === "Conservative"
        ? "Same market input, more defensive interpretation: wait for confirmation and keep capital preservation ahead of momentum."
        : risk === "Aggressive"
          ? "Same market input, more tolerant interpretation: a measured build/watch posture is acceptable while the sentiment conflict stays explicit."
          : "Same market input, balanced interpretation: stay engaged, but wait for sentiment to confirm the constructive price structure.",
    weights,
  };
}

export function createInstantAnalysis(
  input: MarketInput,
  risk: RiskProfile,
  issueMode: IssueMode,
  portfolioConcentration = 42.8,
): OrchestratorResult {
  const technical = buildTechnicalAgent(input, issueMode);
  const fundamental = buildFundamentalAgent(input, issueMode);
  const sentiment = buildSentimentAgent(input, issueMode);
  const synthesis = synthesize(input, technical, fundamental, sentiment, risk, portfolioConcentration);
  const allEvidence = [...fundamental.evidence, ...sentiment.evidence];
  const retrievalRelevance = allEvidence.length
    ? Math.round(allEvidence.reduce((sum, source) => sum + source.relevance, 0) / allEvidence.length)
    : 0;
  return {
    input,
    technical,
    fundamental,
    sentiment,
    dimensions: [...technical.dimensions, ...fundamental.dimensions, ...sentiment.dimensions],
    synthesis,
    issueMode,
    metrics: {
      sessionId: `SF-${input.symbol}-${input.timestamp.slice(11, 19).replaceAll(":", "")}`,
      timestamp: input.timestamp,
      symbol: input.symbol,
      technicalLatencyMs: 0,
      fundamentalLatencyMs: 0,
      sentimentLatencyMs: 0,
      synthesisLatencyMs: 0,
      totalAnalysisMs: 0,
      retrievedDocuments: allEvidence.length,
      retrievalRelevance,
      confidence: synthesis.confidence,
      portfolioConcentration,
      demoBacktestAccuracy: demoBacktestAccuracy(),
      accuracyLabel: "DEMO / BACKTEST",
      status: issueMode === "none" ? "complete" : "partial",
    },
  };
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function runOrchestrator(
  input: MarketInput,
  risk: RiskProfile,
  issueMode: IssueMode,
  portfolioConcentration = 42.8,
): Promise<OrchestratorResult> {
  const startedAt = Date.now();
  const runTimed = async <T>(duration: number, task: () => T) => {
    const start = Date.now();
    await wait(duration);
    return { result: task(), latencyMs: Math.max(1, Date.now() - start) };
  };
  const [technical, fundamental, sentiment] = await Promise.all([
    runTimed(640, () => buildTechnicalAgent(input, issueMode)),
    runTimed(780, () => buildFundamentalAgent(input, issueMode)),
    runTimed(510, () => buildSentimentAgent(input, issueMode)),
  ]);
  const synthesisStart = Date.now();
  const synthesis = synthesize(
    input,
    technical.result,
    fundamental.result,
    sentiment.result,
    risk,
    portfolioConcentration,
  );
  const allEvidence = [...fundamental.result.evidence, ...sentiment.result.evidence];
  const totalAnalysisMs = Math.max(1, Date.now() - startedAt);
  const retrievalRelevance = allEvidence.length
    ? Math.round(allEvidence.reduce((sum, source) => sum + source.relevance, 0) / allEvidence.length)
    : 0;
  return {
    input,
    technical: technical.result,
    fundamental: fundamental.result,
    sentiment: sentiment.result,
    dimensions: [
      ...technical.result.dimensions,
      ...fundamental.result.dimensions,
      ...sentiment.result.dimensions,
    ],
    synthesis,
    issueMode,
    metrics: {
      sessionId: `SF-${input.symbol}-${String(Date.now()).slice(-6)}`,
      timestamp: input.timestamp,
      symbol: input.symbol,
      technicalLatencyMs: technical.latencyMs,
      fundamentalLatencyMs: fundamental.latencyMs,
      sentimentLatencyMs: sentiment.latencyMs,
      synthesisLatencyMs: Math.max(1, Date.now() - synthesisStart),
      totalAnalysisMs,
      retrievedDocuments: allEvidence.length,
      retrievalRelevance,
      confidence: synthesis.confidence,
      portfolioConcentration,
      demoBacktestAccuracy: demoBacktestAccuracy(),
      accuracyLabel: "DEMO / BACKTEST",
      status: issueMode === "none" ? "complete" : "partial",
    },
  };
}

const backtestRows = [
  { predicted: "BULLISH", actual: "BULLISH" },
  { predicted: "NEUTRAL", actual: "BULLISH" },
  { predicted: "BEARISH", actual: "BEARISH" },
  { predicted: "BULLISH", actual: "NEUTRAL" },
  { predicted: "BULLISH", actual: "BULLISH" },
  { predicted: "NEUTRAL", actual: "NEUTRAL" },
] as const;

export function demoBacktestAccuracy() {
  const matches = backtestRows.filter((row) => row.predicted === row.actual).length;
  return Math.round((matches / backtestRows.length) * 100);
}

export function compareProfiles(
  input: MarketInput,
  issueMode: IssueMode,
  portfolioConcentration = 42.8,
) {
  const base = createInstantAnalysis(input, "Conservative", issueMode, portfolioConcentration);
  const aggressive = createInstantAnalysis(input, "Aggressive", issueMode, portfolioConcentration);
  return { conservative: base.synthesis, aggressive: aggressive.synthesis, input };
}
