import React from 'react';
import Navbar from '../components/NavBar/NavBar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';
import { Helmet } from 'react-helmet';

const RootLayout = () => {
    return (
        <div className='w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 space-y-3 sm:space-y-4 lg:space-y-6'>
            <Helmet>
                <title>Home | AssetVerse</title>
            </Helmet>
            <Navbar></Navbar>
            <main className="min-h-screen">
                <Outlet></Outlet>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;