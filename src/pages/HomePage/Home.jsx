import React from 'react';
import HeroSection from './HeroSection';
import FeaturedClubsSection from './FeaturedClubsSection';
import UpcomingEvents from './UpcomingEvents';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturedClubsSection></FeaturedClubsSection>
            <UpcomingEvents></UpcomingEvents>
        </div>
    );
};

export default Home;