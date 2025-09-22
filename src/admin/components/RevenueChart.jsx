import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useOrders } from "../../context/OrdersContext";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Dashboard() {
  const { orders } = useOrders();

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    if (!orders) return;

    // --- Revenue Over Time ---
    const revenueByMonth = {};
    orders.forEach(order => {
      if (!order.createdAt) return;
      const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      const monthIndex = date.getMonth();
      const monthName = MONTHS[monthIndex];
      revenueByMonth[monthName] = (revenueByMonth[monthName] || 0) + (order.total || 0);
    });

    const monthsSoFar = MONTHS.slice(0, new Date().getMonth() + 1);
    const lineArr = monthsSoFar.map((m, i) => ({
      month: m,
      revenue: revenueByMonth[m] || 0,
      prevRevenue: i === 0 ? 0 : (revenueByMonth[monthsSoFar[i - 1]] || 0),
    }));
    setLineData(lineArr);

    // --- Orders Breakdown (Pie) ---
    const statusCount = {};
    orders.forEach(o => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });
    const pieArr = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
    setPieData(pieArr);

    // --- Top Products (Bar) ---
    const productCount = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        productCount[item.name] = (productCount[item.name] || 0) + item.qty;
      });
    });
    const barArr = Object.entries(productCount)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    setBarData(barArr);

  }, [orders]);

  // last month comparison
  const last = lineData[lineData.length - 1] || { revenue: 0, prevRevenue: 0 };
  const isIncrease = last.revenue >= last.prevRevenue;
  const diff = last.revenue - last.prevRevenue;
  const totalOrders = pieData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-4 lg:grid-cols-3 gap-6">
      {/* Area (Revenue) Chart */}
           <Card className="relative overflow-hidden">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Revenue Over Time</CardTitle>
          <div
            className={`flex items-center text-sm font-medium ${
              isIncrease ? "text-green-600" : "text-red-600"
            }`}
          >
            {isIncrease ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {isIncrease ? `+$${diff}` : `-$${Math.abs(diff)}`}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={lineData} margin={{ top: 20, right: 10, bottom: 20, left: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorPrevRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, "dataMax + 150"]} />
              <Tooltip formatter={(value) => `$${value}`} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#60a5fa"
                fill="url(#colorRevenue)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="prevRevenue"
                stroke="#2563eb"
                fill="url(#colorPrevRevenue)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie (Orders Breakdown) */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle>Orders Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="w-full h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} orders`} />
                <Legend verticalAlign="bottom" height={40} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pb-10 pointer-events-none">
              <span className="text-lg font-bold text-gray-700">{totalOrders} Orders</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar (Top Products) */}
      <Card className="relative flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip cursor={0} />
              <Bar dataKey="sales" fill="#10b981" barSize={16} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    
    </div>
  );
}
