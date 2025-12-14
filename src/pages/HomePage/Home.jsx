import React from 'react';
import HeroSection from './HeroSection';
import FeaturedClubsSection from './FeaturedClubsSection';
import UpcomingEvents from './UpcomingEvents';
import HowClubSphereWorks from './HowClubSphereWorks';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturedClubsSection></FeaturedClubsSection>
            <UpcomingEvents></UpcomingEvents>
            <HowClubSphereWorks></HowClubSphereWorks>
        </div>
    );
};

export default Home;