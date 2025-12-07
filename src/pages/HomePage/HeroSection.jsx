import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaArrowRight, FaUsers, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { GiCompass, GiFireworkRocket } from 'react-icons/gi';

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5 overflow-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-5 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-5 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="container relative mx-auto px-4 py-12 md:py-20">
        {/* Hero Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-6xl mx-auto"
        >
          {/* Animated Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full mb-8 shadow-lg"
            whileHover={{ scale: 1.05 }}
            animate={pulseAnimation}
          >
            <motion.span
              animate={floatAnimation}
              className="text-2xl"
            >
              ✨
            </motion.span>
            <span className="font-bold text-lg">Join 10,000+ Passionate Members</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <GiFireworkRocket className="text-xl" />
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <motion.span
                className="relative inline-block"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(59,130,246,0.5)", 
                    "0 0 30px rgba(168,85,247,0.8)", 
                    "0 0 20px rgba(59,130,246,0.5)"
                  ] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Community
                <motion.div
                  className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </motion.span>
            </h1>
            
            {/* Animated Compass */}
            <motion.div
              className="absolute -top-4 -right-4 md:-right-10 text-6xl md:text-8xl text-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <GiCompass />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover <span className="font-semibold text-primary">local clubs</span> and communities 
            that match your passion. From photography to tech—your tribe is waiting.
          </motion.p>

          {/* Search Bar */}
          {/* <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg"
                animate={pulseAnimation}
              />
              <div className="relative bg-white rounded-2xl shadow-2xl p-2 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex items-center pl-4">
                    <FaSearch className="text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search clubs, interests, or locations..."
                      className="w-full px-4 py-5 text-lg focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex items-center pr-2">
                    <FaMapMarkerAlt className="text-gray-400 text-xl mr-2" />
                    <select className="border-l pl-2 pr-4 py-2 text-gray-600 focus:outline-none bg-transparent">
                      <option>Near me</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Anywhere</option>
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary rounded-xl px-8 py-3 font-bold ml-4"
                    >
                      Explore
                      <FaArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> */}

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12"
          >
            {[
              { 
                number: "500+", 
                label: "Active Clubs", 
                icon: "🏢",
                delay: 0 
              },
              { 
                number: "10K+", 
                label: "Happy Members", 
                icon: "👥",
                delay: 0.1 
              },
              { 
                number: "2K+", 
                label: "Monthly Events", 
                icon: "📅",
                delay: 0.2 
              },
              { 
                number: "4.9", 
                label: "Average Rating", 
                icon: <FaStar className="inline text-amber-500" />,
                delay: 0.3 
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200"
              >
                <motion.div
                  className="text-3xl mb-3 inline-block"
                  animate={floatAnimation}
                  transition={{ delay: index * 0.5 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
          >
            <Link to="/clubs">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59,130,246,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg rounded-full px-10 py-4 text-lg font-bold group"
              >
                <span className="flex items-center">
                  Explore Clubs
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-3"
                  >
                    <FaArrowRight />
                  </motion.span>
                </span>
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline btn-secondary btn-lg rounded-full px-10 py-4 text-lg font-bold border-2"
              >
                <span className="flex items-center">
                  Start Your Club
                  <FaUsers className="ml-3" />
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap justify-center gap-6 mt-8 text-gray-600"
          >
            {[
              "✅ Free to join",
              "⭐ Verified communities",
              "🔒 Safe & secure",
              "🔄 No long-term commitment"
            ].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-medium">{badge}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400 flex flex-col items-center"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-primary rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating Elements (Decorative) */}
        <motion.div
          className="hidden lg:block absolute top-40 left-10 text-4xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          📸
        </motion.div>

        <motion.div
          className="hidden lg:block absolute top-60 right-20 text-5xl"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎨
        </motion.div>

        <motion.div
          className="hidden lg:block absolute bottom-40 left-1/4 text-3xl"
          animate={{
            x: [0, 20, 0],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          💻
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;