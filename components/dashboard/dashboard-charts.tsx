import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
];

interface ChartsProps {
  data: {
    trends: any;
    distributions: any;
    overview: any;
  };
  showAll?: boolean;
}

export function DashboardCharts({ data, showAll = false }: ChartsProps) {
  // Safely prepare data with fallbacks
  const leadsSource = Object.entries(data?.overview?.leads?.bySource || {}).map(
    ([name, value]) => ({
      name: name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      value: value as number,
    })
  );

  const leadsStatus = Object.entries(data?.overview?.leads?.byStatus || {}).map(
    ([name, value]) => ({
      name: name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      value: value as number,
    })
  );

  interface ThemeItem {
    label?: string;
    name?: string;
    tourCount?: number;
  }

  const themeData = (data?.distributions?.toursByTheme || [])
    .slice(0, 8)
    .map((theme: ThemeItem) => ({
      name: theme.label || theme.name || 'Unknown',
      tours: theme.tourCount || 0,
    }))
    .filter((item: { name: string; tours: number }) => item.tours > 0);

  const userGrowth = (data?.trends?.usersGrowth || []).map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.count || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Leads Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Leads by Source */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Distribution across different channels</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {leadsSource.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leadsSource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {leadsSource.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-62.5 items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads by Status */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
            <CardDescription>Current status of all leads</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {leadsStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={leadsStatus}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-62.5 items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tours by Theme */}
      {themeData.length > 0 && (
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Tours by Theme</CardTitle>
            <CardDescription>Top performing tour themes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={themeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tours" fill="#82ca9d" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* User Growth Trend */}
      {showAll && userGrowth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
