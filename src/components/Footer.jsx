import { FaPhoneAlt, FaWhatsapp, FaBirthdayCake } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© 2025 Chituru & Iheanyi Golden Jubilee Celebration. All rights reserved.</p>
        
        <p>
          <FaBirthdayCake className="cake-icon" /> 
          Design and hosted by Totlesoft Technologies
        </p>
        
        <p className="contact-info">
          <a 
            href="tel:+2347064931387" 
            className="contact-link"
            aria-label="Call us"
          >
            <FaPhoneAlt className="phone-icon" />
          </a>
          
          <a
            href="https://wa.me/2347064931387"
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="whatsapp-icon" />
          </a>
          
          +2347064931387
        </p>
      </div>
    </footer>
  )
}