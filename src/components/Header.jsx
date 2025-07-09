import { motion } from 'framer-motion';
import himage from '../images/cover.jpg';

export default function Header() {
  return (
    <motion.div 
      className="header-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="header-image">
        <div className="header-gradient" />
        <img
          src={himage}
          alt="Golden Jubilee Celebration"
          className="header-main-image"
          onError={(e) => {
            e.target.style.display = 'none';
            document.querySelector('.header-image').style.backgroundImage = 
              'linear-gradient(to right, var(--primary), var(--secondary))';
          }}
        />
      </div>
    </motion.div>
  );
}