import { motion } from 'framer-motion'
import { FaCrown } from 'react-icons/fa'
import himage from '../images/sponsors/kil.png';
import himage2 from '../images/sponsors/ast.png';
import himage3 from '../images/sponsors/tsoft.png';

const sponsors = [
  { id: 1, name: "Kilimanjaro", image: himage},
  { id: 2, name: "Aston Martin", image: himage2 },
  { id: 3, name: "TotleSoft", image: himage3 },
  // Add more sponsors as needed
]

export default function Sponsors() {
  return (
    <motion.section 
      className="sponsors-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <h3>
          <FaCrown className="gold-crown" /> Supported By <FaCrown className="gold-crown" />
        </h3>
        
        <div className="sponsors-grid">
          {sponsors.map((sponsor) => (
            <motion.div 
              key={sponsor.id}
              className="sponsor-logo"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img 
                src={sponsor.image} 
                alt={sponsor.name}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'block'
                }}
              />
              <div className="placeholder">{sponsor.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}