// TO DO:

// directors and cast after backend payload is updated

import React, {useContext} from 'react'
import { FaRegBookmark, FaBookmark} from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from '../App';

export default function MovieCard (props) {

    const {imdb_id, banner, title, ageRating, genre, year, desc, avgRating, cast, director} = props
    const navigate = useNavigate()
    // if in wishlist for boolean
    const [inWishList, setInWishList] = React.useState('')
    const userId = useContext(UserContext)
    const [blockList, setBlockList] = React.useState([])

    const searchTheme = (genre) => {
        let search = '/search?q=' + genre + '&c=Genre&p=1';
        navigate(search)
    }

    const getWishlist = async () => {
        if (!userId) {
            return
        }

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
            console.log(response.data.body.wishlist)
            response.data.body.wishlist.forEach(i => {
                wishList.push(i.movie_id)
            })

            if (wishList.includes(imdb_id)) {
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
    }, [])

    const change = async () => {
        if (!userId) {
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
                movieId: imdb_id
            },
        }
        
        const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            setInWishList(!inWishList)
            console.log(response)
        }
    }  

    return (
        <div className='text-white px-12'>
            <div className="flex flex-col items-start gap-y-4 lg:gap-y-0 lg:flex-row lg:justify-between pt-8 pb-8 lg:pb-0 md:pb-0 overflow-x-auto">
                {ageRating === "-" ? (
                    <p className='text-3xl'>{title}</p>
                ) : (
                    <p className='text-3xl'>{title} ({ageRating})</p>
                )}
                <div className='flex flex-row items-center gap-4 whitespace-nowrap'>
                    <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
                        <button onClick={change}>
                            {inWishList ? (
                                <FaBookmark />
                            ) : (
                                <FaRegBookmark />
                            )}
                        </button>
                    </IconContext.Provider>
                    <div className="bg-yellow-400 font-bold rounded-xl p-1.5 text-black">{!isNaN(avgRating) ? avgRating : "No Ratings"}</div>
                    {genre.map(item => {
                        return (
                            <button
                                onClick={() => searchTheme(item)}
                                key={item}
                                className="border border-white-500 font-bold px-4 py-2 rounded-full outline-none focus:outline-none mb-1"
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-center lg:self-start sm:py-12 gap-20">
                <div className="overflow-visible w-40 h-40 mb-12 lg:mb-0 block ml-auto mr-auto lg:mr-0 lg:ml-0">
                    <img src={banner} alt="movie-poster" />
                </div>
                <div className='flex flex-col lg:px-0 text-justify'>
                    <p className='max-w-4xl border-b pb-4'>{desc}</p>
                    <div className='flex flex-row gap-10 mt-4 border-b pb-4'>
                        <p>Director</p>
                        <p className='text-md'>{director}</p>
                    </div>
                    <div className='flex flex-row gap-10 mt-4 border-b pb-4'>
                        <p>Cast</p>
                        <p className='text-md'>{cast[1].name}</p>
                        <p className='text-md'>{cast[2].name}</p>
                    </div>
                    <div className='flex flex-row gap-10 mt-4 border-b pb-4'>
                        <p>Released</p>
                        <p className='text-md'>{year}</p>
                    </div>
                </div>
            </div>
        </div>
    
    )
}
