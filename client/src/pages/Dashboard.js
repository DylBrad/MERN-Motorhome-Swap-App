import TinderCard from 'react-tinder-card'
import React from 'react'
import ChatContainer from '../components/ChatContainer'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const Dashboard = () => {

  const [ user, setUser ] = React.useState({})
  const [ locatedUsers, setLocatedUsers ] = React.useState(null)
  const [lastDirection, setLastDirection] = React.useState()
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const userId = cookies.UserId

  // Set the logged in user from userId
  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: { userId }
      })
      setUser(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  const getUsersByLocation = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users-location',{
        params: { usersLocation: user?.location_interest }
      })
      setLocatedUsers(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getUser()
  }, [])

  React.useEffect(() => {
    if (user) {
      getUsersByLocation()
    }
  }, [user])




  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put('http://localhost:8000/add-match', {
        userId,
        matchedUserId
      })
      getUser()
    } catch (error) {
      console.log(error)
    }
  }

  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
      updateMatches(swipedUserId)
    }
    setLastDirection(direction)
  }
  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  // Get matched users IDs
  const matchedUserIds = user.matches?.map(({ user_id }) => user_id).concat(userId)
  // Remove already matched users by IDs
  const filteredLocatedUsers = locatedUsers?.filter(
    locatedUser => !matchedUserIds.includes(locatedUser.user_id)
  )

  return (
    <>
      {user && 
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="card-container">
              {filteredLocatedUsers?.map((locatedUser) =>
                <TinderCard 
                  className='swipe' 
                  key={locatedUser.user_id}
                  onSwipe={(dir) => swiped(dir, locatedUser.user_id)} 
                  onCardLeftScreen={() => outOfFrame(locatedUser.user_name)}
                >
                  <div 
                  style={{ backgroundImage: 'url(' + locatedUser.url + ')' }} 
                  className='card'
                  >
                    <h3>{locatedUser.user_name}</h3>
                  </div>
                </TinderCard>
              )}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p></p>}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Dashboard