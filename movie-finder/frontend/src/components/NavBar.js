import { AppBar, Button, IconButton, Toolbar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../App.css'
import SearchBar from './SearchBar'
import logo from '../assets/FindAMovie.svg'

// const useStyles = makeStyles(theme => ({
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

const navigation = [
  { name: 'WishList', href: '/', current: false, pageLink: '/' },
  // log in or log out depends on user token
  { name: 'Account', href: '/:u_id', current: false, pageLink: '/' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function NavBar() {
  // const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q')
  // get filter value
  const c = searchParams.get('c')
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const u_id = sessionStorage.getItem('token')

  const handleHomeClick = () => {
    // setOpen(true);
    navigate('/home')
  };

  const handleProfileClick = () => {
    // setOpen(false);
    if (!u_id) {
      navigate('/login')
    }
    navigate(`/${u_id}`)
    window.location.reload(true)
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <AppBar position="static" sx={{bgcolor: 'black'}}>
        <Toolbar>
          <div onClick={() => handleHomeClick()}>
            <img src={logo} alt="logo" className='cursor-pointer'/>
          </div>
          <SearchBar prevQuery={q} prevCategory={c} />
          <IconButton aria-label="account" onClick={() => handleProfileClick()}>
            <AccountCircleIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="logout" onClick={() => handleLogout()}>
            <LogoutIcon sx={{ height: 34, width: 34 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default NavBar;
