import Nav from "../components/Nav"
import AuthModal from "../components/AuthModal"
import React from 'react'
import { useCookies } from 'react-cookie'

const Home = () => {

  const [ showAuthModal, setShowAuthModal ] = React.useState(false)
  const [isSignUp, setIsSignUp] = React.useState(true)
  const [ cookies, setCookie, removeCookie ] = useCookies(['user'])
  const authToken = cookies.AuthToken 

  const handleClick = () => {
    if (authToken) {
      removeCookie('UserId', cookies.UserId)
      removeCookie('AuthToken', cookies.AuthToken)
      window.location.reload()
      return
    }
    setShowAuthModal(true)
    setIsSignUp(true)
  }
  return (
    <div className="content-container">
      <Nav 
        authToken={authToken}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1>Van Swap</h1>
        <button className="primary-button" onClick={handleClick}>
          { authToken ? 'Sign Out' : 'Create Account'}
        </button>
        {showAuthModal && (
          <AuthModal 
            setShowAuthModal={setShowAuthModal}
            isSignUp={isSignUp}
        />)}
      </div>
    </div>
  )
}

export default Home