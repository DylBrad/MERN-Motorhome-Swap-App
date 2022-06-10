import logo from "../images/icons8-van-98.png"

const Nav = (props) => {

  const handleClick = () => {
    props.setShowAuthModal(true)
    props.setIsSignUp(false)
  }

  return (
    <nav>
      <div className="logo-container">
        <img className="logo" src={logo} alt="logo"/>
      </div>
 
      {!props.authToken && <button 
          className="nav-button" 
          onClick={handleClick}
          disabled={props.showAuthModal}
        >Log In</button>}
    </nav>
  )
}

export default Nav