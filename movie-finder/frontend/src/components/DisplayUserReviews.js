import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrow90DegRight, BsArrow90DegLeft } from 'react-icons/bs'
import Stars from './Stars';

function DisplayUserReview(props) {
    const {u_id, isUser} = props

    const [open, setOpen] = useState(false)
    const [userReviews, setUserReviews] = useState([])
    const [reviewId, setReviewId] = React.useState('')
    const [showMore, setShowMore] = useState(7)

    const getUserReviews = async () => {
        const init = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/user/reviews/${u_id}/`,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            setUserReviews(response.data.body)
        }
    }

    const deleteReview = async (reviewId) => {
        const init = {
            method: 'DELETE',
            url: `http://localhost:8080/api/v1/movie/${u_id}/review/remove/${reviewId}`,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            getUserReviews();
        }
    }

    useEffect(() => {
        getUserReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = () => setShowMore(showMore + 7)
    const collapseClick = () => setShowMore(7)

    return (
        <div className='px-12'>
            <h1 className="text-3xl my-2 ">Reviews</h1>
            {userReviews.length !== 0 ?
                <>
                {userReviews.slice(0, showMore).map((item, key) => {
                    const posted = new Date(item.time)
                    console.log(item)
                    return (
                        parseInt(u_id) === item.user_id ? (
                            <div className="flex border-b py-8 border-gray-100 px-8" key={key}>
                                <div className='mr-2'>
                                    <Link to={`/movies/${item.movieId}`}>
                                        <img className='max-w-[10vw] min-w-[8vw]' src={item.banner} alt={item.movie_title} />
                                    </Link>
                                </div>
                                <div className="flex flex-col grow">
                                    <div className='flex flex-row justify-between pb-8'>
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-2 lg:gap-4 md:gap-2 underline hover:text-blue-400">
                                            <Link to={`/movies/${item.movieId}`}>{item.movie_title}</Link>
                                        </div>
                                        <p>
                                            {posted.getDate() + "/" + (posted.getMonth() + 1) + "/" + posted.getFullYear()}
                                        </p>
                                    </div>
                                    <p className='text-justify max-w-5xl align-left'>
                                        {item.content}
                                    </p>
                                    <div className='flex flex-row justify-between items-center pt-4'>
                                        <Stars filled={item.userRating} />
                                        {isUser && <button
                                            className='w-20 bg-red-500 hover:bg-red-400 text-white font-bold py-0.5 border-b-4 border-red-700 hover:border-red-500 rounded mt-3'
                                            onClick={() => {
                                                setOpen(true)
                                                setReviewId(item.id)
                                            }}
                                        >
                                            Delete
                                        </button>}
                                    </div>
                                </div>
                                {/* Delete review modal */}
                                {open ? (
                                    <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden lg:bg-gray-900 lg:bg-opacity-50 md:bg-gray-900 md:bg-opacity-50 overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex">
                                        <div className="relative w-full h-full max-w-2xl p-4 md:h-auto">
                                            <div className="relative bg-white rounded-lg shadow bg-gray-700">
                                                <div className="flex items-start justify-between p-4 border-b border-gray-600">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Are you sure?
                                                    </h3>
                                                    <button 
                                                        onClick={() => {
                                                            setOpen(false)
                                                            setReviewId('')
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
                                                            deleteReview(reviewId)
                                                        }}
                                                    >
                                                        Delete Review
                                                    </button>
                                                    <button
                                                        className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600"
                                                        onClick={() => {
                                                            setOpen(false)
                                                            setReviewId('')
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (<></>)}
                            </div>
                        ) : (
                            <div className="flex flex-col border-b p-8 border-gray-100" key={key}>
                                <div className='flex flex-row justify-between pb-8'>
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-2 lg:gap-4 md:gap-2 underline hover:text-blue-400">
                                        <Link to={`/${item.user_id}`}>{item.user_name}</Link>
                                    </div>
                                    <p>
                                        {posted.getDate() + "/" + (posted.getMonth() + 1) + "/" + posted.getFullYear()}
                                    </p>
                                </div>
                                <p className='text-justify max-w-5xl align-left'>
                                    {item.content}
                                </p>
                                <div className='flex flex-row justify-between items-center pt-4'>
                                    <Stars filled={item.userRating} />
                                </div>
                            </div>
                        )
                    )
                })}

                {/* Only alows to show 7 * n movies at a time */}
                {showMore >= userReviews.length ? (
                    userReviews.length <= 7 ? (
                        <></>
                    ) : (
                        <div className="flex flex-row justify-center p-8">
                            <button
                                onClick={() => collapseClick()}
                                className="hover:bg-black-500 font-semibold py-2 px-4 border border-white-500 hover:bg-blue-500 hover:border-blue-500 rounded-md"
                            >
                                <div className="flex flex-row items-center gap-2">
                                    Collapse <BsArrow90DegLeft className="rotate-90" size={13}/>
                                </div>
                            </button>
                        </div>
                    )
                ) : (
                    <div className="flex flex-row justify-center p-8">
                        <button
                            onClick={() => handleClick()}
                            className="hover:bg-black-500 font-semibold py-2 px-4 border border-white-500 hover:bg-blue-500 hover:border-blue-500 rounded-md"
                        >
                            <div className="flex flex-row items-center gap-2">
                                Expand <BsArrow90DegRight className="rotate-90" size={13}/>
                            </div>
                        </button>
                    </div>
                )}
                </>
            :
                <p className="text-center">You have no reviews yet</p> 
            }
        </div>
    );
}

export default DisplayUserReview;