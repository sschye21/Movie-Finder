// TO DO

// need to get all current comments for the movie and its rating to add as prop to <MovieCard />

import React from 'react'
import { useParams } from 'react-router';
import axios from 'axios'
import NavBar from '../components/NavBar';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import MovieReviews from '../components/MovieReviews';
import Loading from '../components/Loading'
import SimilarMovies from '../components/SimilarMovies';

export default function Movie () {
    const params = useParams()
    const [movieData, setMovieData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [avgRating, setAvgRating] = React.useState('No Ratings')
    const [similarMovieData, setSimilarMovieData] = React.useState([])
    const [director, setDirector] = React.useState("")

    React.useEffect(() => {
        getMovieData();
        getSimilarMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMovieData = async () => {
        const init = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/movie/details/${params.imdb_id}/`,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            setMovieData(response.data)
            console.log(response.data.cast)
            response.data.cast.forEach(item => {
                if (item.role === "Director") {
                    setDirector(item.name)
                    return
                }
            })
        }
    }

    const getSimilarMovies = async () => {
        const init = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/movie/details/${params.imdb_id}/similar`,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            for (let movie in response.data) {
                const imdb_id = response.data[movie].imdb_id
                const init = {
                    method: 'GET',
                    url: `http://localhost:8080/api/v1/movie/details/${imdb_id}/`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const resp = await axios.request(init).catch(e => alert(e.resp.data.error))
                if (resp !== undefined && resp.status === 200) {
                    setSimilarMovieData(similarMovieData => [...similarMovieData, resp.data])
                    setLoading(false)
                }
            }
        }
    }
    
    return (
        <>
            {loading === false ? (
                <>
                    <NavBar />
                    <div className="flex flex-col min-h-screen items-center pb-8">
                        <div className='flex flex-col max-w-full'>
                            <MovieCard
                                imdb_id={params.imdb_id}
                                banner={movieData.banner}
                                title={movieData.title}
                                ageRating={movieData.rating}
                                genre={movieData.genre}
                                year={movieData.year}
                                desc={movieData.description}
                                avgRating={avgRating}
                                cast={movieData.cast}
                                director={director}
                            />
                            <MovieReviews 
                                setAvgRating={setAvgRating}
                            />
                            <SimilarMovies 
                                similarMovieData={similarMovieData}
                            />
                        </div>
                    </div>
                    <Footer />
                </>
            ) : (
                <Loading />
            )}
        </>
        
    )
}
