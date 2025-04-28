import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import img from "../assets/8_U2_A0157_260b64d4b4.jpg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Truck,
  ShoppingBag,
  CreditCard
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [chartView, setChartView] = useState('line');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/dashboard/stats", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        } else {
          console.error("Failed to fetch stats:", data.message);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  const handleRefresh = async () => {
    setLoading(true);
    if (token) {
      try {
        const res = await fetch("http://localhost:4000/api/dashboard/stats", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error refreshing stats:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-purple-600 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  // Format data for charts
  const salesData = {
    labels: stats?.orderStats.map(stat => stat._id) || [],
    datasets: [{
      label: 'Daily Sales',
      data: stats?.orderStats.map(stat => stat.total) || [],
      borderColor: 'rgb(124, 58, 237)',
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgb(124, 58, 237)',
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} DT`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return value + ' DT';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Sample category distribution data
  const categoryData = {
    labels: ['Men', 'Women', 'Kids'],
    datasets: [{
      data: [35, 45, 20],
      backgroundColor: [
        'rgba(124, 58, 237, 0.8)',
        'rgba(219, 39, 119, 0.8)',
        'rgba(245, 158, 11, 0.8)'
      ],
      borderColor: [
        'rgb(124, 58, 237)',
        'rgb(219, 39, 119)',
        'rgb(245, 158, 11)'
      ],
      borderWidth: 1
    }]
  };

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icons
  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'processing':
        return <RefreshCw size={16} className="text-blue-600" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-600" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen max-w-5xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black to-black/80 py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-purple-200 mt-1">Welcome to your analytics overview</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Products</p>
                  <h3 className="text-2xl font-bold">{stats?.totalProducts || 0}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-green-500 text-xs font-medium">+5.2%</span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="bg-purple-100 rounded-lg p-3">
                  <Package size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-purple-500"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <h3 className="text-2xl font-bold">{stats?.totalOrders || 0}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-green-500 text-xs font-medium">+12.3%</span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="bg-pink-100 rounded-lg p-3">
                  <ShoppingCart size={24} className="text-pink-600" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-pink-500"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats?.totalUsers || 0}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-green-500 text-xs font-medium">+8.7%</span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="bg-blue-100 rounded-lg p-3">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-blue-500"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold">{stats?.totalRevenue || '0'} DT</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-green-500 text-xs font-medium">+15.4%</span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <CreditCard size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-green-500"></div>
          </div>
        </div>

        {/* Sales Chart & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
                <p className="text-sm text-gray-500">Revenue trends over time</p>
              </div>
              <div className="flex mt-4 sm:mt-0">
                <div className="bg-gray-100 rounded-lg flex p-1 text-sm">
                  <button 
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 rounded-md ${timeRange === 'week' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 rounded-md ${timeRange === 'month' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'}`}
                  >
                    Month
                  </button>
                  <button 
                    onClick={() => setTimeRange('year')}
                    className={`px-3 py-1 rounded-md ${timeRange === 'year' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'}`}
                  >
                    Year
                  </button>
                </div>
                <div className="bg-gray-100 rounded-lg flex p-1 text-sm ml-2">
                  <button 
                    onClick={() => setChartView('line')}
                    className={`px-3 py-1 rounded-md ${chartView === 'line' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'}`}
                  >
                    Line
                  </button>
                  <button 
                    onClick={() => setChartView('bar')}
                    className={`px-3 py-1 rounded-md ${chartView === 'bar' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'}`}
                  >
                    Bar
                  </button>
                </div>
              </div>
            </div>
            <div className="h-64 md:h-80">
              {chartView === 'line' ? (
                <Line data={salesData} options={chartOptions} />
              ) : (
                <Bar data={salesData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Category Distribution</h3>
            <p className="text-sm text-gray-500 mb-6">Products by category</p>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={categoryData} options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      boxWidth: 8
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <p className="text-sm text-gray-500">Latest customer purchases</p>
            </div>
            <a href="#" className="text-purple-600 text-sm font-medium hover:text-purple-800">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {stats?.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                          {order.firstName?.[0]}{order.lastName?.[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{order.firstName} {order.lastName}</p>
                          <p className="text-xs text-gray-500">{order.email || 'customer@example.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.total} DT</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-purple-600 hover:text-purple-900 font-medium text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Best Selling Products</h3>
                <p className="text-sm text-gray-500">Top products by sales</p>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">Premium T-Shirt</h4>
                    <p className="text-xs text-gray-500">Men's Clothing</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">49.99 DT</p>
                    <p className="text-xs text-green-600">+24.5% <ArrowUpRight size={12} className="inline" /></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest system events</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: <ShoppingBag size={14} />, color: 'text-purple-600 bg-purple-100', text: 'New product added', time: '2 minutes ago' },
                { icon: <Users size={14} />, color: 'text-blue-600 bg-blue-100', text: 'New customer registered', time: '1 hour ago' },
                { icon: <Truck size={14} />, color: 'text-green-600 bg-green-100', text: 'Order #3947 shipped', time: '3 hours ago' },
                { icon: <RefreshCw size={14} />, color: 'text-amber-600 bg-amber-100', text: 'Inventory updated', time: '5 hours ago' },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className={`mt-0.5 p-2 rounded-full ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;