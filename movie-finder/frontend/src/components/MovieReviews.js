import React, { useContext } from "react";
import Stars from '../components/Stars';
import { Link } from 'react-router-dom';
import { BsArrow90DegRight, BsArrow90DegLeft } from 'react-icons/bs'
import { UserContext } from "../App";
import axios from 'axios';
import { useParams } from 'react-router';
import StarsRating from 'react-star-rate'
import TotalRatings from '../components/TotalRatings';
import LoginToReview from '../components/LoginToReview'

export default function MovieReviews ({ setAvgRating }) {

    const userId = useContext(UserContext)
    const params = useParams()
    const [open, setOpen] = React.useState(false)
    const [showMore, setShowMore] = React.useState(7)
    const [reviews, setReviews] = React.useState([])
    const [newReview, setNewReview] = React.useState("")
    const [rating, setRating] = React.useState(0);
    const [openStar, setOpenStar] = React.useState(false)
    const [one, setOne] = React.useState(0);
    const [two, setTwo] = React.useState(0);
    const [three, setThree] = React.useState(0);
    const [four, setFour] = React.useState(0);
    const [five, setFive] = React.useState(0);
    const [reviewId, setReviewId] = React.useState('')
    const [blockList, setBlockList] = React.useState([])
    const [alrReviewed, setAlrReviewed] = React.useState('')

    React.useEffect(() => {
		getBlockedUsers()
        getReviews();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getBlockedUsers = async () => {
		const init = {
			method: "GET",
			url: `http://localhost:8080/api/v1/user/${userId}/block`,
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
			setBlockList(response.data.body)
        }
	}

    const addReview = async () => {
        const init = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/movie/${userId}/review/add`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                movieId: params.imdb_id,
                content: newReview,
                rating: rating.toString()
            }
        }

        const response = await axios.request(init).catch(e => alert(e.response.data.error))

        if (response !== undefined && response.status === 200) {
            console.log(response)
            getReviews()
        }
    }

    const getReviews = async () => {
        const init = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/movie/${parseInt(userId)}/review/get`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                movieId: params.imdb_id
            }
        }

        const response = await axios.request(init).catch(e => alert(e.response.data.error))

        if (response !== undefined && response.status === 200) {
            // Sorting reviews by time posted
            let reviewsTemp = response.data.body
            reviewsTemp.forEach(element => {
                element.time = element.time + "Z"
            })
            const sorted = reviewsTemp.sort((a, b) => (a.time < b.time) ? 1 : ((a.time > b.time) ? -1 : 0))
            setReviews(sorted)

            // Percentage component
            let oneTemp = 0, twoTemp = 0, threeTemp = 0, fourTemp = 0, fiveTemp = 0
            sorted.forEach(element => {
                if (element.userRating === 1) oneTemp++
                else if (element.userRating === 2) twoTemp++
                else if (element.userRating === 3) threeTemp++
                else if (element.userRating === 4) fourTemp++
                else if (element.userRating === 5) fiveTemp++
            })

            setOne(oneTemp ? Math.floor((oneTemp / sorted.length) * 100) : oneTemp)
            setTwo(twoTemp ? Math.floor((twoTemp / sorted.length) * 100): twoTemp)
            setThree(threeTemp ? Math.floor((threeTemp / sorted.length) * 100) : threeTemp)
            setFour(fourTemp ? Math.floor((fourTemp / sorted.length) * 100) : fourTemp)
            setFive(fiveTemp ? Math.floor((fiveTemp / sorted.length) * 100) : fiveTemp)

            let total = 0
            sorted.forEach(element => {
                total += element.userRating
            })

            setAvgRating(total === 5 ? 10 : ((total / sorted.length) * 2).toFixed(1))
        }
    }
 
    const deleteReview = async (reviewId) => {
        const init = {
            method: 'DELETE',
            url: `http://localhost:8080/api/v1/movie/${userId}/review/remove/${reviewId}`,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await axios.request(init).catch(e => alert(e.response.data.error))

        if (response !== undefined && response.status === 200) {
            getReviews();
        }
    }

    const handleClick = () => setShowMore(showMore + 7)
    const collapseClick = () => setShowMore(7)

    return (
        <div className="text-white px-4">
            <p className="text-3xl pl-8 pt-12 lg:pt-0 md:pt-0">Reviews</p>
            <p className="text-sm pl-8 pt-4 text-slate-400">{reviews.length} Reviews</p>
            <div className='mt-12 px-8 lg:px-8 pb-24'>
                <TotalRatings 
                    five={five + "%"}
                    four={four + "%"}
                    three={three + "%"}
                    two={two + "%"}
                    one={one + "%"}
                />
                
                {/* Adding a review */}
                {userId ? (
                    <div className="flex max-w-full mb-4">
                        {/* Must add a rating modal */}
                        {openStar ? (
                            <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden lg:bg-gray-900 lg:bg-opacity-50 md:bg-gray-900 md:bg-opacity-50 overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex">
                                <div className="relative w-full h-full max-w-2xl p-4 md:h-auto">
                                    <div className="relative bg-white rounded-lg shadow bg-gray-700">
                                        <div className="flex items-start justify-between p-4 border-b border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {alrReviewed}
                                            </h3>
                                            <button
                                                onClick={() => setOpenStar(false)}
                                            >
                                                X
                                            </button>
                                        </div>
                                        <div className="flex flex-row justify-end p-6 space-x-2 border-t border-gray-200 border-gray-600">
                                            <button
                                                className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700"
                                                onClick={() => setOpenStar(false)}
                                            >
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : <></>}
                        <form className="w-full bg-gray-700 rounded-lg px-4 pt-2 text-white" onSubmit={e => {
                            if (rating === 0) {
                                setAlrReviewed("You must add a rating!")
                                setOpenStar(true)
                                e.preventDefault()
                                return
                            } else {
                                for (let item in reviews) {
                                    if (reviews[item].user_id === parseInt(userId)) {
                                        setAlrReviewed("You have already added your review!")
                                        e.preventDefault()
                                        setOpenStar(true)
                                        return
                                    }
                                }
                                e.preventDefault()
                                addReview()
                                setRating(0)
                                e.target.reset()
                            }
                        }}>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <h2 className="px-4 pt-3 pb-2 text-white text-lg">Add a New Review</h2>
                                <div className="w-full md:w-full px-3 mb-2 mt-2">
                                    <textarea
                                        className="bg-gray-700 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 text-white placeholder-white"
                                        name="body"
                                        placeholder='Add a review'
                                        required
                                        onChange={e => setNewReview(e.target.value)}
                                    />
                                    <div className='flex flex-row pt-4'>
                                        <StarsRating
                                            value={rating}
                                            onChange={value => {
                                                setRating(value)
                                            }}
                                            allowHalf={false}
                                            allowClear={true}
                                        />
                                    </div> 
                                </div>
                                <div className="w-full md:w-full flex flex-row justify-end md:w-full px-3">
                                    <input
                                        type='submit'
                                        className="font-medium py-1 px-4 rounded-lg tracking-wide mr-1 bg-blue-500 cursor-pointer hover:bg-blue-900"
                                        value='Post Review'
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                ): (
                    <LoginToReview />
                )}
                
                {/* Displaying the review */}
                {reviews.slice(0, showMore).map((item, key) => {
                    const posted = new Date(item.time)
                    return (
                        parseInt(userId) === item.user_id ? (
                            <div className="flex flex-col border-b py-8 border-gray-100 px-8" key={key}>
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
                                    <button
                                        className='w-20 bg-red-500 hover:bg-red-400 text-white font-bold py-0.5 border-b-4 border-red-700 hover:border-red-500 rounded mt-3'
                                        onClick={() => {
                                            setOpen(true)
                                            setReviewId(item.id)
                                        }}
                                    >
                                        Delete
                                    </button>
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
                {showMore >= reviews.length ? (
                    reviews.length <= 7 ? (
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
            </div>
        </div>
    )
}
