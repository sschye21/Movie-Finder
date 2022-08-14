import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { FaRegBookmark, FaBookmark} from 'react-icons/fa'
import { UserContext } from '../App';
import axios from 'axios';

const MovieCover = (props) => {
  const navigate = useNavigate()
  const handleCoverClick = () => {
    navigate('/movies/' + props.movie_id)
    if (props.reloadReq) window.location.reload()   
  }

  
  const [inWishList, setInWishList] = React.useState('')
  const userId = useContext(UserContext)

  const getWishlist = async () => {
    if (userId === null) return

    const init = {
        method: 'GET',
        url: `http://localhost:8080/api/v1/user/${userId}`,
        headers: {
            'Content-type': 'application/json'
        }
    }

    const response = await axios.request(init).catch(e => alert(e.response.data.error))
    let wishList = []
    if (response !== undefined && response.status === 200) {
        response.data.body.wishlist.forEach(i => {
            wishList.push(i.movie_id)
        })
        if (wishList.includes(props.movie_id)) {
            setInWishList(true)
        } else {
            setInWishList(false)
        }
    }
  }

  // initial load of the page whether the user has added the movie to wishlist or not
  React.useEffect(() => {
      getWishlist()        
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const change = async () => {
    if (userId === null) {
      navigate("/login")
      return
    }

    const click = !inWishList
    const init = {
        method: (click ? 'POST' : 'DELETE'),
        url: `http://localhost:8080/api/v1/user/${userId}/wishlist/`,
        headers: {
            'Content-type': 'application/json'
        },
        data: {
            movieId: props.movie_id
        },
    }
    
    const response = await axios.request(init).catch(e => alert(e.response.data.error))
    if (response !== undefined && response.status === 200) {
        setInWishList(!inWishList)
    }
  }

  return (
    <Card sx={{ display: 'flex', border: "none", boxShadow: "none" }} >
      <Box
        sx={{ position: 'relative', boxShadow: 5, margin: 'auto', cursor: 'pointer' }}
      >
        <CardMedia
          component="img"
          height="200"
          image={props.image_url}
          onClick={() => handleCoverClick()}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.54)',
            color: 'white',
            padding: '5px',
          }}
        >
          <Typography variant="h6" align="center">{props.title} </Typography>
          <Typography variant="body2" align="center">{props.rating} • {props.length}min • {props.year} </Typography>
        </Box>
          <button className='absolute top-3 left-3 h-8 bg-black text-white p-px' onClick={change}>
            {inWishList ? (
              <FaBookmark size={20} />
            ) : (
              <FaRegBookmark size={20} />
            )}
          </button>
      </Box>
    </Card>
  );
}

export default MovieCover;