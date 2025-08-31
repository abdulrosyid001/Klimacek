import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import DashboardMain from '../components/DashboardMain';
import DroneControl from '../components/drone-control';
import WeatherStation from '../components/WeatherStation';
import Footer from '../components/Footer';

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
	const router = useRouter();
	useEffect(() => {
		router.replace("/page");
	}, [router]);
	return null;
}
//
