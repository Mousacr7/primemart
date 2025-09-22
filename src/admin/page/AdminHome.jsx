import React from 'react'
import DashboardCards  from "../components/Dashboard"
import RevenueChart from '../components/RevenueChart';
import Orders from '../components/Orders';
import { Client } from '../components/Client';
export const AdminHome = () => {
  return (
    <> <div className="p-8 mx-4 rounded-md shadow-sm bg-white ">
          <h1 className="text-3xl  font-bold mb-4">Good morning user 👋</h1>
          <p className="text-gray-700">Welcome to your dashboard</p>
          {/* Dashboard cards and charts go here */}
          </div>
          <DashboardCards />
          <RevenueChart />
         <Client />
          <Orders />
          </>
  )
}
