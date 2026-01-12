import React from 'react';
import HeroSection from './HeroSection';
import FeaturedClubsSection from './FeaturedClubsSection';
import UpcomingEvents from './UpcomingEvents';
import HowClubSphereWorks from './HowClubSphereWorks';
import Testimonials from './Testimonials';
import PopularCategories from './PopularCategories';
import BenefitsSection from './BenefitsSection';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturedClubsSection></FeaturedClubsSection>
            <UpcomingEvents></UpcomingEvents>
            <HowClubSphereWorks></HowClubSphereWorks>
            <Testimonials></Testimonials>
            <PopularCategories></PopularCategories>
            <BenefitsSection></BenefitsSection>
        </div>
    );
};

export default Home;