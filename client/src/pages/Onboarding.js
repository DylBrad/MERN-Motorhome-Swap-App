import Nav from '../components/Nav'
import React, { useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import Select from 'react-select'
import countryList from 'react-select-country-list'


const Onboarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [ formData, setFormData ] = React.useState({
    user_id: cookies.UserId,
    user_name: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    location: '',
    location_interest: '',
    url: '',
    about: '',
    matches: []
  })

  //update form data on change
  const handleChange = (e) => {
    const value = e.target.value
    const name = e.target.name
    console.log(name, value)

    setFormData((prevState) => ({
      ...prevState,
      [name] : value
    }))
  }

  // User loacation drop down menu react-select-country-list
  const [value, setValue] = React.useState('')

  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = (value) => {
    setValue(value)

    setFormData((prevState) => ({
      ...prevState,
      location : value.label
    }))
  }

  // dummy data for 'show me vans from' dropdown menu
  // TODO: populate with array from MongoDb values from user profile 'locations'
  // test code
  const [ locations, setLocations ] = React.useState('')
  const [ country, setCountry ] = React.useState('')

  const getExistingUserLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/existing-locations')

      setLocations(response.data)

    } catch (err) {
      console.log(err)
    }
  }
  React.useEffect(() => {
    getExistingUserLocations()
  })

  const changeCountryHandler = (country) => {
    setCountry(country)

    setFormData((prevState) => ({
      ...prevState,
      location_interest : country.label
    }))
  }


  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    console.log("Submitted")
    e.preventDefault()
    try {
      const response = await axios.put('http://localhost:8000/user', { formData })
      const success = response.status === 200
      if (success) navigate('/dashboard')
    } catch(err) {
      console.log(err)
    }
  }

  const authToken = true

  return (
    <div>
      <Nav 
        showAuthModal={false}
        setShowAuthModal={() => {}}
        authToken={authToken}
      />
      <div className='onboarding'>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <section>

            <label htmlFor='first_name'>First Name</label>
            <input
              id='user_name'
              type='text'
              name='user_name'
              placeholder='User Name'
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />

            <label>Date Of Birth</label>
            <div className='multiple-input-container'>
              <input
                id='dob_day'
                type='number'
                name='dob_day'
                placeholder='dd'
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                id='dob_month'
                type='number'
                name='dob_month'
                placeholder='mm'
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                id='dob_year'
                type='number'
                name='dob_year'
                placeholder='yyyy'
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>
            

            <label>My Location:</label>
            <div>
              <Select options={options} value={value} onChange={changeHandler} required={true} />
            </div>
            <label>Show Me Vans From:</label>
            <div>
              <Select options={locations} value={country} onChange={changeCountryHandler}  required={true}  />
            </div>


            <label htmlFor='about'>About me</label>
            <input
              id='about'
              type='text'
              name='about'
              required={true}
              placeholder='Write a description of your van.'
              value={formData.dob_about}
              onChange={handleChange}
            />

            <input type='submit' />
          </section>

          <section>
            <label htmlFor='about'>Profile Picture</label>
            <input
              id='url'
              type='url'
              name='url'
              required={true}
              onChange={handleChange}
            />
            <div className='photo-container'>
              {formData.url && <img src={formData.url} alt="profile pic preview"></img>}
            </div>
          </section>
        </form>

      </div>
    </div>
  )
}

export default Onboarding

