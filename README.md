# FinSight AI

### Personalized Financial Intelligence, Backed by Evidence

FinSight AI is a multi-agent financial intelligence platform designed to help retail investors understand market signals through explainable, evidence-backed and personalized AI analysis.

The platform combines market data, technical indicators, sentiment analysis, financial-document retrieval (RAG), user risk profiling and multi-agent reasoning to generate personalized financial insights.

---

## 🚀 Key Features

### 🤖 Multi-Agent AI Architecture

FinSight AI uses multiple specialized AI agents that independently analyze different aspects of the market:

- **Technical Agent** – analyzes price momentum, RSI, moving averages and market trends.
- **Fundamental Agent** – analyzes financial information using Retrieval-Augmented Generation (RAG).
- **Sentiment Agent** – analyzes relevant news and market sentiment.
- **Synthesis Agent** – combines the outputs of the specialized agents with the user's risk profile to generate the final intelligence.

The specialized agents are designed to execute independently/in parallel before their structured outputs are consumed by the synthesis layer.

---

### 📊 Signal Classification

The system evaluates market information across multiple independent dimensions:

- Price / momentum
- Volume / market activity
- Sentiment

Each dimension produces:

- Signal classification
- Confidence score
- Reasoning

The system then generates an overall classification such as:

**BULLISH · NEUTRAL · BEARISH**

with an explainable confidence level.

---

### 📚 Retrieval-Augmented Generation (RAG)

The Fundamental Agent uses a document retrieval pipeline to ground financial analysis in source material.

The RAG pipeline:

```text
Financial Documents
        ↓
Document Processing
        ↓
Document Retrieval
        ↓
Relevant Evidence
        ↓
Fundamental Agent
        ↓
Grounded Analysis
