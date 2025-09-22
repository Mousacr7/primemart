import {  useState } from 'react';
import Aside from './components/Aside';
import Nav from "./components/Nav"
import { Outlet } from 'react-router-dom';


function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false); // control mobile toggle

  return (
    <div className="flex h-screen overflow-x-hidden  bg-gray-50">
      {/* Aside content in the left saide  */}
    <Aside mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      
      <div className="flex-1  ">

     
      {/* Main content */}
      <main className=" p-1  lg:ml-60 mt-16 ">
      <Nav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>  {/* your Nav component */}
      <Outlet />
      </main>
        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm p-4">
          © 2025 MyApp. All rights reserved.
        </footer>
         </div>
    </div>
  );
}


export default AdminLayout;
