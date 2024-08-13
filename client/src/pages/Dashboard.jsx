import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react';
import DashSidebar from '../components/DashSidebar';
import DashProfile from "../components/DashProfile";
import DashPosts from '../components/DashPosts';
import DashUsers from "../components/DashUsers";
import DashComments from '../components/DashComments';


export default function Dashboard() {
  const location=useLocation();
  const [tab,setTab]=useState('');

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    if(tabFromUrl)
    {
      setTab(tabFromUrl);
    }
  },[location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/**Sidebar */}
        <DashSidebar/>
      </div>
      
      {/*Profile and all */}
      {tab==='profile' && <DashProfile/>}
      {/*Posts */}
      {tab==='posts' && <DashPosts/>}
      {/*To Show all users */}
      {tab==='users' && <DashUsers/>}
      {/*For all comments in the dashboard */}
      {tab==='comments' && <DashComments/>}
    </div>
  )
}
