import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';
import { Helmet } from 'react-helmet';

const RootLayout = () => {
    return (
        <div className='max-w-11/12 md:max-w-10/12 mx-auto space-y-3'>
            <Helmet>
                <title>Home | AssetVerse</title>
            </Helmet>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;