import axios from "axios"
import React from "react"
import { useCookies } from "react-cookie"

const MatchesDisplay = (props) => {

  const [ matchedUsers, setMatchedUsers ] = React.useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(null)

  const userId = cookies.UserId

  const matchedUserIdsArray = props.matches?.map(({ user_id }) => user_id)
  const stringUserIds = JSON.stringify(matchedUserIdsArray)

  const getMatches = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users', {
        params: { userIds: stringUserIds }
      })
      setMatchedUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getMatches()
  }, [props.matches])  

  // Filter users who ALSO matched with you
  const filteredMatchedUsers = matchedUsers?.filter(
    (matchedUser) => 
      matchedUser.matches.filter((profile) => profile.user_id === userId)
        .length > 0
  )


  return (
    <div className="matches-display">
      {filteredMatchedUsers?.map((match, _index) => (
        <div key={_index} className="match-card" onClick={() => props.setClickedUser(match)}>
          <div className="image-container">
            <img src={match?.url} alt={`${match?.user_name}'s profile`} />
          </div>
          <h3>{match?.user_name}</h3>
        </div>
      ))}
    </div>
  )
}

export default MatchesDisplay