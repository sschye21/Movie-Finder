import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

async function registerUser(credentials) {
  return fetch('http://localhost:8080/api/v1/user/register', {
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
      alert(data.message)
    })
 }

function Register({setToken}) {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: ''
  })
  const [open, setOpen] = React.useState('')
  const [error, setError] = React.useState('')
  
  const handleSubmit = async e => {
    e.preventDefault();
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/ig
    const emailRegexResult = emailRegex.test(input.email)

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    const passwordRegexResult = passwordRegex.test(input.password)

    if (!emailRegexResult) {
      setOpen(true)
      setError("Please enter a valid email")
      return
    }

    if (input.firstName === "") {
      setOpen(true)
      setError("Please enter a first name")
      return
    }

    if (input.lastName === "") {
      setOpen(true)
      setError("Please enter a last name")
      return
    }

    if (input.userName === "") {
      setOpen(true)
      setError("Please enter a username")
      return
    }

    if (input.password === "" || input.confirmPassword === "") {
      setOpen(true)
      setError("Please input a password or confirm your password!")
      return
    }

    if (!passwordRegexResult) {
      setOpen(true)
      setError("Your password must contain at least 8 characters, an upper case character, a special character and 1 number")
      return
    }

    if (input.password !== input.confirmPassword) {
      setOpen(true)
      setError("Password do not match")
      return
    }

    const token = await registerUser({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      userName: input.userName,
      password: input.password
    });
    setToken(token)
    navigate('/')
  }

  const handleChange = (prop) => (event) => {
    setInput({ ...input, [prop]: event.target.value });
  };

  return (
    <div className="bg-cover h-screen" style={{backgroundImage: "url('https://culturalpolitics.net/index/sites/default/files/inline-images/Abm0wRq.jpg')"}}>
      <div className="shadow-lg max-w-md ml-[65vw] p-8 border border-gray-100 bg-white h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold pb-8">Please Register</h1>
        <form className="w-[100%]" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">First Name</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('firstName')}/>
          </div>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Last Name</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('lastName')}/>
          </div>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Email</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('email')}/>
          </div>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Username</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('userName')}/>
          </div>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" onChange={handleChange('password')}/>
          </div>
          <div className="mb-4">
            <label className="pr-5 block text-gray-700 text-sm font-bold mb-2 text-left">Confirm Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" onChange={handleChange('confirmPassword')}/>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m2" type="submit">Submit</button>
        </form>
        <p className="text-center text-gray-500 text-xs pt-3">Already have an account?</p>
        <Link to="/login">
          <p className="hover:font-bold">Click here to login</p>
        </Link>
      </div>
      {/* Form validation modal */}
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
                        >
                            X
                        </button>
                    </div>
                    <div className="flex flex-row justify-end p-6 space-x-2 border-t border-gray-200 border-gray-600">
                        <button
                            className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700"
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
  );
}

export default Register;

Register.propTypes = {
  setToken: PropTypes.func.isRequired
};