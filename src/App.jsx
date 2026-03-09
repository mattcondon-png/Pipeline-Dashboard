import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  "Digital Health": "#38bdf8",
  "Enterprise": "#a78bfa",
  "Health Plan": "#34d399",
  "Strategic": "#f97316",
};
const YEAR_COLORS = { 2025: "#1e3a5f", 2026: "#6e1140" };

const fmt = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1e3).toFixed(0)}K`;

// ── Data ──────────────────────────────────────────────────────────────────────
const janMarTotal = [
  { year: 2025, opps: 139, arr: 27824258 },
  { year: 2026, opps: 98,  arr: 37321880 },
];

const byMonth = [
  { month: "Jan", y2025: 7501493,  y2026: 9861123  },
  { month: "Feb", y2025: 11689198, y2026: 17846725 },
  { month: "Mar", y2025: 8633567,  y2026: 9614033  },
];
const byMonthOpps = [
  { month: "Jan", y2025: 57, y2026: 54 },
  { month: "Feb", y2025: 40, y2026: 20 },
  { month: "Mar", y2025: 42, y2026: 24 },
];

const bySegment = [
  { seg: "Digital Health", y2025: 6209866,  y2026: 7932143  },
  { seg: "Enterprise",     y2025: 6485810,  y2026: 2400958  },
  { seg: "Health Plan",    y2025: 6307577,  y2026: 4669888  },
  { seg: "Strategic",      y2025: 7256255,  y2026: 22233892 },
];
const bySegmentOpps = [
  { seg: "Digital Health", y2025: 54, y2026: 26 },
  { seg: "Enterprise",     y2025: 45, y2026: 27 },
  { seg: "Health Plan",    y2025: 13, y2026: 13 },
  { seg: "Strategic",      y2025: 20, y2026: 25 },
];

const segMonthDetail = [
  { label: "Jan '25", "Digital Health": 1702873, Enterprise: 2717853, "Health Plan": 1250000, Strategic: 1830767  },
  { label: "Feb '25", "Digital Health": 2693886, Enterprise: 1220974, "Health Plan": 3700000, Strategic: 3324338  },
  { label: "Mar '25", "Digital Health": 1813107, Enterprise: 2546983, "Health Plan": 1357577, Strategic: 2101150  },
  { label: "Jan '26", "Digital Health": 3250750, Enterprise: 1285258, "Health Plan": 1169888, Strategic: 4070227  },
  { label: "Feb '26", "Digital Health": 1364225, Enterprise: 392500,  "Health Plan": 3500000, Strategic: 12590000 },
  { label: "Mar '26", "Digital Health": 3317168, Enterprise: 723200,  "Health Plan": 0,       Strategic: 5573665  },
];

// ── Components ────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 700 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || "#e2e8f0", marginBottom: 2 }}>
          {p.name}: {p.value > 999 ? fmt(p.value) : p.value}
        </div>
      ))}
    </div>
  );
};

const Delta = ({ from, to }) => {
  const pct = ((to - from) / from) * 100;
  const up = pct >= 0;
  return (
    <span style={{ color: up ? "#34d399" : "#f87171", fontWeight: 700, fontSize: 13, marginLeft: 6 }}>
      {up ? "▲" : "▼"}{Math.abs(pct).toFixed(0)}%
    </span>
  );
};

const Card = ({ children, style }) => (
  <div style={{ background: "#1e293b", border: "1px solid #273549", borderRadius: 12, ...style }}>{children}</div>
);

const Toggle = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    background: active ? "#334155" : "transparent",
    border: "1px solid " + (active ? "#475569" : "#334155"),
    color: active ? "#f1f5f9" : "#94a3b8",
    borderRadius: 6, padding: "4px 14px", cursor: "pointer",
    fontSize: 12, fontFamily: "inherit", transition: "all .15s"
  }}>{children}</button>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [monthMetric, setMonthMetric] = useState("arr");
  const [segMetric, setSegMetric] = useState("arr");

  const [d25, d26] = janMarTotal;
  const arrPct = ((d26.arr - d25.arr) / d25.arr) * 100;
  const oppsPct = ((d26.opps - d25.opps) / d25.opps) * 100;
  const avg25 = d25.arr / d25.opps;
  const avg26 = d26.arr / d26.opps;

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: "#0f172a", minHeight: "100vh", color: "#e2e8f0", padding: "32px 28px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Sales Pipeline · YoY</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f8fafc", letterSpacing: -0.5, marginBottom: 4 }}>Jan – Mar: 2025 vs 2026</h1>
        <div style={{ color: "#64748b", fontSize: 13 }}>Created Date basis · Mar 2026 partial through Mar 9</div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { label: "2025 ARR", value: fmt(d25.arr), sub: `${d25.opps} opps`, color: YEAR_COLORS[2025] },
          { label: "2026 ARR", value: fmt(d26.arr), sub: `${d26.opps} opps`, color: YEAR_COLORS[2026], deltaArr: arrPct, deltaOpps: oppsPct },
          { label: "Avg Deal Size 2025", value: fmt(avg25), sub: "per opportunity", color: YEAR_COLORS[2025] },
          { label: "Avg Deal Size 2026", value: fmt(avg26), sub: "per opportunity", color: YEAR_COLORS[2026], deltaArr: ((avg26 - avg25) / avg25) * 100 },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "18px 20px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: "#f1f5f9", letterSpacing: -1 }}>
              {k.value}
              {k.deltaArr !== undefined && <Delta from={100} to={100 + k.deltaArr} />}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Monthly breakdown */}
      <Card style={{ padding: "20px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Monthly Breakdown</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Jan, Feb, Mar — 2025 vs 2026</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Toggle active={monthMetric === "arr"} onClick={() => setMonthMetric("arr")}>ARR</Toggle>
            <Toggle active={monthMetric === "opps"} onClick={() => setMonthMetric("opps")}>Opps</Toggle>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthMetric === "arr" ? byMonth : byMonthOpps} barCategoryGap="30%" barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#273549" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={monthMetric === "arr" ? fmt : v => v} width={54} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Bar dataKey="y2025" name="2025" fill={YEAR_COLORS[2025]} radius={[3,3,0,0]} />
            <Bar dataKey="y2026" name="2026" fill={YEAR_COLORS[2026]} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* inline month deltas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
          {byMonth.map((m, i) => {
            const arrD = ((m.y2026 - m.y2025) / m.y2025) * 100;
            const oppsD = ((byMonthOpps[i].y2026 - byMonthOpps[i].y2025) / byMonthOpps[i].y2025) * 100;
            return (
              <div key={m.month} style={{ background: "#151f2e", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>{m.month}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>
                  ARR: <span style={{ color: arrD >= 0 ? "#34d399" : "#f87171", fontWeight: 700 }}>{arrD >= 0 ? "▲" : "▼"}{Math.abs(arrD).toFixed(0)}%</span>
                  <span style={{ color: "#475569", marginLeft: 6 }}>{fmt(m.y2025)} → {fmt(m.y2026)}</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  Opps: <span style={{ color: oppsD >= 0 ? "#34d399" : "#f87171", fontWeight: 700 }}>{oppsD >= 0 ? "▲" : "▼"}{Math.abs(oppsD).toFixed(0)}%</span>
                  <span style={{ color: "#475569", marginLeft: 6 }}>{byMonthOpps[i].y2025} → {byMonthOpps[i].y2026}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Segment comparison */}
      <Card style={{ padding: "20px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>By Sales Segment</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Jan–Mar total per segment</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Toggle active={segMetric === "arr"} onClick={() => setSegMetric("arr")}>ARR</Toggle>
            <Toggle active={segMetric === "opps"} onClick={() => setSegMetric("opps")}>Opps</Toggle>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={segMetric === "arr" ? bySegment : bySegmentOpps} barCategoryGap="30%" barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#273549" />
            <XAxis dataKey="seg" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={segMetric === "arr" ? fmt : v => v} width={54} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Bar dataKey="y2025" name="2025" fill={YEAR_COLORS[2025]} radius={[3,3,0,0]} />
            <Bar dataKey="y2026" name="2026" fill={YEAR_COLORS[2026]} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Stacked segment x month */}
      <Card style={{ padding: "20px 22px", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Segment Mix by Month</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 16 }}>Stacked ARR — how the mix shifts month to month</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={segMonthDetail} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#273549" />
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} width={54} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            {Object.keys(COLORS).map(seg => (
              <Bar key={seg} dataKey={seg} stackId="a" fill={COLORS[seg]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Segment detail table */}
      <Card style={{ padding: "20px 22px", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>Segment Detail</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #273549" }}>
              {["Segment", "2025 ARR", "2026 ARR", "ARR YoY", "2025 Opps", "2026 Opps", "Opps YoY", "Avg Deal '25", "Avg Deal '26", "Avg YoY"].map(h => (
                <th key={h} style={{ textAlign: h === "Segment" ? "left" : "right", color: "#64748b", fontWeight: 600, paddingBottom: 8, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, paddingRight: 8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bySegment.map((r, i) => {
              const o = bySegmentOpps[i];
              const arrPct = ((r.y2026 - r.y2025) / r.y2025) * 100;
              const oppsPct = ((o.y2026 - o.y2025) / o.y2025) * 100;
              const avg25 = r.y2025 / o.y2025;
              const avg26 = r.y2026 / o.y2026;
              const avgPct = ((avg26 - avg25) / avg25) * 100;
              const Chg = ({ p }) => <span style={{ color: p >= 0 ? "#34d399" : "#f87171", fontWeight: 700 }}>{p >= 0 ? "▲" : "▼"}{Math.abs(p).toFixed(0)}%</span>;
              return (
                <tr key={r.seg} style={{ borderBottom: "1px solid #1a2535" }}>
                  <td style={{ padding: "9px 8px 9px 0", fontWeight: 700, color: COLORS[r.seg] }}>{r.seg}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px", color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>{fmt(r.y2025)}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px", color: "#f1f5f9", fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{fmt(r.y2026)}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px" }}><Chg p={arrPct} /></td>
                  <td style={{ textAlign: "right", padding: "9px 8px", color: "#94a3b8" }}>{o.y2025}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px", color: "#f1f5f9", fontWeight: 600 }}>{o.y2026}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px" }}><Chg p={oppsPct} /></td>
                  <td style={{ textAlign: "right", padding: "9px 8px", color: "#94a3b8", fontFamily: "'DM Mono',monospace" }}>{fmt(avg25)}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px", color: "#f1f5f9", fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{fmt(avg26)}</td>
                  <td style={{ textAlign: "right", padding: "9px 8px" }}><Chg p={avgPct} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Top 5 deals per year */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 14, paddingTop: 16, borderTop: "1px solid #273549" }}>Top 5 Deals by ARR</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { year: 2025, color: YEAR_COLORS[2025], deals: [
                { account: "PAREXEL International Corp.", segment: "Strategic", arr: 1795960, month: "Feb" },
                { account: "Eli Lilly and Co.", segment: "Strategic", arr: 1369900, month: "Mar" },
                { account: "Molina Healthcare", segment: "Health Plan", arr: 1000000, month: "Feb" },
                { account: "United Healthcare", segment: "Health Plan", arr: 1000000, month: "Feb" },
                { account: "HCSC (Cigna MA)", segment: "Health Plan", arr: 850000, month: "Feb" },
              ]},
              { year: 2026, color: YEAR_COLORS[2026], deals: [
                { account: "Novo Nordisk A/S", segment: "Strategic", arr: 7100000, month: "Feb", note: "Honolulu Phase 2" },
                { account: "CMS", segment: "Health Plan", arr: 3000000, month: "Feb" },
                { account: "Novo Nordisk A/S", segment: "Strategic", arr: 2900000, month: "Feb", note: "Honolulu Phase 1" },
                { account: "OpenAI", segment: "Digital Health", arr: 2500000, month: "Mar" },
                { account: "ICON PLC", segment: "Strategic", arr: 2000000, month: "Mar" },
              ]},
            ].map(({ year, color, deals }) => (
              <div key={year} style={{ background: "#151f2e", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 12, borderLeft: `3px solid ${color}`, paddingLeft: 8 }}>{year} Top Deals</div>
                {deals.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: i < 4 ? "1px solid #1e2d3d" : "none" }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{d.account}{d.note ? <span style={{ color: "#475569", fontWeight: 400 }}> — {d.note}</span> : ""}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                        <span style={{ color: COLORS[d.segment] || "#64748b" }}>{d.segment}</span>
                        <span style={{ marginLeft: 6 }}>· {d.month}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: "#f1f5f9", whiteSpace: "nowrap" }}>{fmt(d.arr)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "📈", title: "Strategic ARR up 206% YoY", body: "From $7.3M to $22.2M — driven almost entirely by Feb 2026 ($12.6M). Fewer but much bigger deals; avg deal size jumped from $363K to $889K." },
          { icon: "🚀", title: "Digital Health growing steadily", body: "ARR up 28% ($6.2M → $7.9M) and avg deal size up meaningfully. Despite half the opps (54 → 26), ARR held strong." },
          { icon: "📉", title: "Enterprise declining sharply", body: "ARR down 63% ($6.5M → $2.4M) with opps down 40% (45 → 27). Average deal size also fell. Consistent pressure across all metrics." },
          { icon: "⚠️", title: "Health Plan softer in 2026", body: "ARR down 26% ($6.3M → $4.7M) — same opp count (13) but less ARR per deal. Feb was strong ($3.5M) but Jan and Mar lagged 2025." },
        ].map((c, i) => (
          <Card key={i} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{c.body}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>
        Created Date basis · 1,063 opportunities · Mar 2026 partial (through Mar 9)
      </div>
    </div>
  );
}
