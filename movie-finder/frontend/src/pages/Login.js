import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function Login({setToken}) {
  const [input, setInput] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  const [open, setOpen] = React.useState('')
  const [error, setError] = React.useState('')

  async function loginUser(credentials) {
    return fetch('http://localhost:8080/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.status === "OK") {
          return data.message
        }
        setError(data.message)
      })
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (input.email === "") {
      setOpen(true)
      setError("Please enter an email")
      return
    }

    if (input.password === "") {
      setOpen(true)
      setError("Please enter a password")
      return
    }
    
    const token = await loginUser({
      email: input.email,
      password: input.password
    });
    if (token === undefined) {
      setOpen(true)
      return
    }
    setToken(token)
    navigate('/')
  }

  const handleChange = (prop) => (event) => {
    setInput({ ...input, [prop]: event.target.value });
  };

  return (
    <div className="bg-cover h-screen" style={{backgroundImage: "url('https://culturalpolitics.net/index/sites/default/files/inline-images/Abm0wRq.jpg')"}}>
      <div className="shadow-lg max-w-md ml-[65vw] p-8 border border-gray-100 bg-white h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold pb-8">Please Log In</h1>
        <form className="w-[100%]" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Email</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('email')}/>
          </div>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" onChange={handleChange('password')}/>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m2" type="submit">Submit</button>
        </form>
        <p className="text-center text-gray-500 text-xs pt-3">Dont have an account?</p>
        <Link to="/register">
          <p className="hover:font-bold">Click here to register</p>
        </Link>
      </div>
      {/* Login validation */}
      {open ? (
        <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden lg:bg-gray-900 lg:bg-opacity-50 md:bg-gray-900 md:bg-opacity-50 overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex">
          <div className="relative w-full h-full max-w-2xl p-4 md:h-auto">
              <div className="relative bg-white rounded-lg shadow bg-gray-700">
                  <div className="flex items-start justify-between p-4 border-b border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {error}
                      </h3>
                      <button 
                          onClick={() => {
                              setOpen(false)
                          }}
                          className="text-white"
                      >
                          X
                      </button>
                  </div>
                  <div className="flex flex-row justify-end p-6 space-x-2 border-t border-gray-200 border-gray-600">
                      <button
                          className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                              setOpen(false)
                          }}
                      >
                          OK
                      </button>
                  </div>
              </div>
          </div>
        </div>
    ) : (<></>)}
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};