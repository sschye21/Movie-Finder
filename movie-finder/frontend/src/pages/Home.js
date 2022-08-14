import React, { useEffect, useState } from 'react';
import Carousel from 'react-grid-carousel';
import { Paper, Button, Container, Grid, Typography } from '@mui/material';
import Footer from '../components/Footer';
import NavBar from "../components/NavBar";
import MovieCover from '../components/MovieCover';
import Loading from '../components/Loading';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const u_id = sessionStorage.getItem('token')

  useEffect(() => {
    setLoading(true)
    getPopularMovies()
    getRecommendedMovies()
  }, [searchParams]);

  const getPopularMovies = async () => {
    let promises = [];
    let res = await axios.get(`http://localhost:8080/api/v1/movie/popular`)
	  let results = res.data
    results.forEach(result => {
      promises.push(axios.get(`http://localhost:8080/api/v1/movie/details/${result.imdb_id}/`))
    })

	  let allPromises = await Promise.all(promises)
    let moviesList = []
    allPromises.forEach(movieObj => {
      moviesList.push(movieObj.data)
    })
    setPopularMovies(moviesList)
    // setLoading(false)
  }

  const getRecommendedMovies = async () => {
    let promises = [];
    let res = await axios.get(`http://localhost:8080/api/v1/user/${u_id}/recommend`)
      .catch(function (error) {
        if (error.response) {
          alert(error.response.data)
          setLoading(false)
        } else if (error.request) {
          alert(error.request)
          setLoading(false)
        } else {
          alert(error.message)
          setLoading(false)
        }
      });
	  let results = res.data
    results.forEach(result => {
      promises.push(axios.get(`http://localhost:8080/api/v1/movie/details/${result.imdb_id}/`)
      .catch(function (error) {
        if (error.response) {
          alert(error.response.data)
          setLoading(false)
        } else if (error.request) {
          alert(error.request)
          setLoading(false)
        } else {
          alert(error.message)
          setLoading(false)
        }
      }))
    })

	  let allPromises = await Promise.all(promises)
    let moviesList = []
    allPromises.forEach(movieObj => {
      moviesList.push(movieObj.data)
    })
    setRecommendedMovies(moviesList)
    setLoading(false)
  }

  const renderMovieCover = (cover, index) => {
    return (
      <Carousel.Item>
        <MovieCover
          movie_id={cover.movie_id}
          image_url={cover.imageUrl}
          title={cover.title}
          description={cover.description}
          year={cover.year}
          rating={cover.rating}
          length={cover.length}
        />
      </Carousel.Item>
    )
  }

  if (isLoading) {
    return (
       <>
          <Loading />
       </>
    )
  }
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      {/* <SearchBar /> */}
      <Container>
        <Typography variant="h4" align="left" color="white">Popular </Typography>
        <Carousel cols={4} rows={1} gap={20} showDots={true} loop mobileBreakpoint={0}
          responsiveLayout={[
              {breakpoint: 1000, cols: 3},
              {breakpoint: 700, cols: 2},
              {breakpoint: 500, cols: 1}
          ]}>
          {popularMovies.map(renderMovieCover)}
        </Carousel>
        <Typography variant="h4" align="left" color="white">Recommended </Typography>
        <Carousel cols={4} rows={1} gap={20} showDots={true} loop mobileBreakpoint={0}
          responsiveLayout={[
              {breakpoint: 1000, cols: 3},
              {breakpoint: 700, cols: 2},
              {breakpoint: 500, cols: 1}
          ]}>
          {recommendedMovies.map(renderMovieCover)}
        </Carousel>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;