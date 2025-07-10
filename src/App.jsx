import React, { useState } from 'react'
import { motion } from 'framer-motion'
//import Header from './components/Header'
import Verification from './components/Verification'
import AdminPanel from './components/AdminPanel'
import Sponsors from './components/Sponsors'
import Footer from './components/Footer'
import Confetti from './components/Confetti'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h2>Something went wrong</h2>
          <p>Check the console for details</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  
  
  return (
    <div className="app">
      <Confetti />
     
      
      <main className="container">
        <ErrorBoundary>
  {isAdmin ? (
    <AdminPanel returnToPublic={() => setIsAdmin(false)} />
  ) : (
    <Verification />
  )}
</ErrorBoundary>
        
        <Sponsors />
      </main>
      
      <Footer />
      
      {/* Hidden admin access (your secret route) */}
      <button 
  className="secret-admin-btn"
  onClick={() => setIsAdmin(!isAdmin)}
  aria-label={isAdmin ? "Exit admin mode" : "Enter admin mode"}
  title={isAdmin ? "Exit Admin" : "Admin Access"}
>
  <i className={`fas fa-${isAdmin ? 'user' : 'lock'}`} style={{
    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
  }} />
</button>
    </div>
  )
}