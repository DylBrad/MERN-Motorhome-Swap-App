import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const AuthModal = (props) => {

  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)
  const [confirmPassword, setConfirmPassword] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  let navigate = useNavigate()

  const handleClick = () => {
    props.setShowAuthModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if(props.isSignUp && (password !== confirmPassword)){
        setError("Passwords do not match.")
        return
      } 
      console.log('posting', {email, password})

      const response = await axios.post(`http://localhost:8000/${props.isSignUp ? 'signup' : 'login'}`, {email, password})

      setCookie('AuthToken', response.data.token)
      setCookie('UserId', response.data.userId)

      const success = response.status === 201

      if (success && props.isSignUp) navigate('/onboarding')
      if (success && !props.isSignUp) navigate('/dashboard')

      window.location.reload()
    
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>✖</div>
      <h2>{props.isSignUp ? "Create Account" : "Log In"}</h2>
      <p>By clicking log in you agree to our privacy and cookie policy.</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {props.isSignUp && <input
          type="password"
          id="password-check"
          name="password-check"
          placeholder="Confirm Password"
          required={true}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />}
        <input className='secondary-button' type="submit" />
        <p>
          {error}
        </p>
      </form>

      <hr/>
      <h2>Mobile App Coming Soon!!</h2>
    </div>
  )
}

export default AuthModal