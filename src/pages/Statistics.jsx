import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { simsData } from '../data/simsData';
import { lotsData } from '../data/lotsData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2, Users, Globe, ChevronDown, ArrowLeft } from 'lucide-react';

const COLORS = ['#A3B95A', '#C0572A', '#4CAF50', '#26C6DA', '#9C27B0', '#FF9800', '#F44336', '#2196F3', '#E91E8C', '#8D6E63', '#00BCD4', '#FFEB3B'];

const simFields = [
  { key: 'ageGroup', label: 'Age Group' },
  { key: 'gender', label: 'Gender' },
  { key: 'occult', label: 'Occult' },
  { key: 'ethnicity', label: 'Ethnicity' },
  { key: 'playableSim', label: 'Playable Sim' },
  { key: 'status', label: 'Status' },
  { key: 'wealthClass', label: 'Wealth Class' },
  { key: 'individualWealthClass', label: 'Individual Wealth Class' },
  { key: 'faith', label: 'Faith' },
  { key: 'addiction', label: 'Addiction' },
  { key: 'alignment', label: 'Alignment' },
  { key: 'orientation', label: 'Orientation' },
  { key: 'fameLevel', label: 'Fame Level' },
  { key: 'world', label: 'World' },
  { key: 'politicalAlignment', label: 'Political Alignment' },
];

const lotFields = [
  { key: 'world', label: 'World' },
  { key: 'lotType', label: 'Lot Type' },
  { key: 'status', label: 'Status' },
  { key: 'lotUse', label: 'Lot Use' },
  { key: 'lotOwner', label: 'Owner' },
  { key: 'neighbourhood', label: 'Neighbourhood' },
  { key: 'size', label: 'Size' },
];

function getBreakdown(data, field) {
  const counts = {};
  data.forEach(item => {
    const val = item[field];
    if (val && String(val).trim()) {
      const key = String(val).trim() || 'Unknown';
      counts[key] = (counts[key] || 0) + 1;
    } else {
      counts['(unset)'] = (counts['(unset)'] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl">
        <p className="text-foreground font-semibold text-sm">{payload[0].payload.name}</p>
        <p className="text-primary text-sm">{payload[0].value} sims</p>
      </div>
    );
  }
  return null;
}

function StatsDashboard({ data, fields, title }) {
  const [field, setField] = useState(fields[0].key);
  const [chartType, setChartType] = useState('bar');

  const breakdown = useMemo(() => getBreakdown(data, field), [data, field]);
  const total = data.length;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative">
          <select
            value={field}
            onChange={e => setField(e.target.value)}
            className="py-2 px-3 pr-8 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
          >
            {fields.map(f => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>

        {/* Chart type toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          {['bar', 'pie', 'table'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 text-xs font-medium transition-colors capitalize ${chartType === type ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground ml-auto">
          {breakdown.length} unique values · {total} total
        </span>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl border border-border p-4">
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={breakdown.slice(0, 20)} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {breakdown.slice(0, 20).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'pie' && (
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={breakdown.slice(0, 12)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label={({ name, percent }) => percent > 0.03 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 0.5 }}
              >
                {breakdown.slice(0, 12).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === 'table' && (
          <div className="overflow-auto max-h-80">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Value</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Count</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2 px-3 text-foreground">{row.name}</td>
                    <td className="py-2 px-3 text-right text-primary font-mono">{row.value}</td>
                    <td className="py-2 px-3 text-right text-muted-foreground text-xs">
                      {((row.value / total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Statistics() {
  const [section, setSection] = useState(null);

  if (!section) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Data</p>
          <h1 className="font-heading text-5xl font-bold text-foreground mb-3">Statistics</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-3" />
          <p className="text-muted-foreground">Explore breakdowns and charts across all sims and lots.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          <motion.button
            className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl text-left"
            onClick={() => setSection('sims')}
            whileHover={{ y: -4 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Sim Statistics</h2>
            <p className="text-muted-foreground text-sm">Breakdowns by age, occult, gender, wealth, faith, and more.</p>
          </motion.button>

          <motion.button
            className="group p-8 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-all duration-300 hover:shadow-xl text-left"
            onClick={() => setSection('lots')}
            whileHover={{ y: -4 }}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">Lot Statistics</h2>
            <p className="text-muted-foreground text-sm">Breakdowns by world, type, status, owner, and more.</p>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setSection(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Statistics Home
          </button>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {section === 'sims' ? 'Sim Statistics' : 'Lot Statistics'}
          </h1>
        </div>

        {section === 'sims' && (
          <StatsDashboard data={simsData} fields={simFields} title="Sims" />
        )}
        {section === 'lots' && (
          <StatsDashboard data={lotsData} fields={lotFields} title="Lots" />
        )}
      </div>
    </div>
  );
}