"use client";

import { 
  Users, Building2, Calendar, TrendingUp, 
  Clock, Award, Bell, DollarSign 
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, Sharmin • System Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              System Healthy
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Employees</p>
                <p className="text-4xl font-bold mt-3">248</p>
              </div>
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Departments</p>
                <p className="text-4xl font-bold mt-3">12</p>
              </div>
              <Building2 className="h-10 w-10 text-purple-600 dark:text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Present Today</p>
                <p className="text-4xl font-bold mt-3">187</p>
                <p className="text-emerald-600 dark:text-emerald-500 text-sm mt-1">75% attendance</p>
              </div>
              <Clock className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Leaves</p>
                <p className="text-4xl font-bold mt-3">14</p>
              </div>
              <Calendar className="h-10 w-10 text-orange-600 dark:text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" /> Recent Activity
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 24 hours</span>
            </div>

            <div className="space-y-5">
              {[
                { text: "New employee 'Rahim Khan' joined as Software Engineer", time: "2 min ago", type: "user" },
                { text: "Leave request approved for Fatima Ahmed (3 days)", time: "35 min ago", type: "leave" },
                { text: "Project 'ERP System' completed with 94% success", time: "1 hour ago", type: "project" },
                { text: "Salary processed for March 2026", time: "3 hours ago", type: "payroll" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start border-b border-gray-100 dark:border-[#1f2a3f] pb-5 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mt-0.5">
                    {item.type === "user" && <Users className="h-4 w-4 text-emerald-600" />}
                    {item.type === "leave" && <Calendar className="h-4 w-4 text-orange-600" />}
                    {item.type === "project" && <Award className="h-4 w-4 text-purple-600" />}
                    {item.type === "payroll" && <DollarSign className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px]">{item.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Overview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pending Approvals */}
            <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Leave Request - Sumi Akter</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">5 Days • Sick Leave</p>
                  </div>
                  <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg">Approve</button>
                </div>
              </div>
            </div>

            {/* Department Summary */}
            <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Departments</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-[#1a2538] p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">IT Department</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a2538] p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">HR Department</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}