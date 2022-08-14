import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import NavBar from '../components/NavBar';
import UserProfile from '../components/UserProfile';

function Profile(props) {
  const params = useParams()

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = React.useState(true)

  const getUserData = async () => {
    const init = {
      method: 'GET',
      url: `http://localhost:8080/api/v1/user/${params.u_id}/`,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await axios.request(init).catch(e => alert(e.response.data.error))
    if (response !== undefined && response.status === 200) {
      setUserData(response.data.body)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <NavBar />
          <div className='flex flex-col min-h-screen'>
            <div className='flex flex-col max-w-full'>
                {userData && <UserProfile 
                  firstName={userData.firstName}
                  lastName={userData.lastName}
                  email={userData.email}
                  u_id={userData.id}
                  password={userData.password}
                  userName={userData.userName}
                  wishlist={userData.wishlist}
                  setUserData={() => {setUserData()}}
                  getUserData={() => getUserData()}
                />}
            </div>
          </div>
          <Footer />
        </>
      ) }
    </>
  );
}

export default Profile;