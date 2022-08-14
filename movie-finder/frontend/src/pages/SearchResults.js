import { Box, Container, Divider, Grid, Pagination } from "@mui/material";
import React, {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import MovieCover from "../components/MovieCover";
import FilterBar from "../components/FilterBar";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import axios from 'axios';
import Loading from "../components/Loading";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  // const [pageNum, setPageNum] = useState(!(searchParams.get('p')) ? 1 ? (searchParams.get('p')));
  const [pageNum, setPageNum] = useState(1)
  const [isLoading, setLoading] = useState(true);
  // get query string
  const q = searchParams.get('q')
  // get filter value
  const c = searchParams.get('c')
  const g = searchParams.get('g')
  const d = searchParams.get('d')
  const year = searchParams.get('year')
  // get sort value e.g. ascending, descending
  const sort = searchParams.get('sortBy')

  const navigate = useNavigate();

  useEffect(() => {
    if (q === '') {
      alert("Search query can't be empty")
      setLoading(false)
      return
    }
    setLoading(true)
    getMovies()
  }, [searchParams]);

  useEffect(() => {
    setPageNum(1)
  }, [q, c]);

  const getMovies = async () => {
    let promises = [];
    let res = {}
    if (c === 'Name') {
      res = await axios.get(`http://localhost:8080/api/v1/movie/search?q=${q}&c=${c}`)
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
      if (g !== null) {
        res = await axios.get(`http://localhost:8080/api/v1/movie/search/filter?q=${q}&c=${c}&g=${g}&d=${d}&year=${year}&sortBy=${sort}`)
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
      }
    } else {
      res = await axios.get(`http://localhost:8080/api/v1/movie/search?q=${q}&c=${c}&p=${pageNum}`)
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
      if (g !== null) {
        res = await axios.get(`http://localhost:8080/api/v1/movie/search/filter?q=${q}&c=${c}&g=${g}&d=${d}&year=${year}&sortBy=${sort}&p=${pageNum}`)
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
      }
    }
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
    setMovies(moviesList)
    setLoading(false)
  }
    
  useEffect(() => {
    let searchQuery = '/search?q=' + q + '&c=' + c + '&p=' + pageNum;
    if (g !== null) {
      searchQuery = '/search?q=' + q + '&c=' + c + '&g=' + g + '&d=' + d + '&year=' + year + '&sortBy=' + sort + '&p=' + pageNum;
    }
    navigate(searchQuery)
  }, [pageNum]);

  const handlePagination = (event, newPage) => {
    setPageNum(newPage);
  }

  const renderMovieCover = (cover, index) => {
    return (
      <Grid item xs={12} sm={6} md={3} key={index} sx={{ border: 0 }} >
        <MovieCover
          movie_id={cover.movie_id}
          image_url={cover.imageUrl}
          title={cover.title}
          description={cover.description}
          year={cover.year}
          rating={cover.rating}
          length={cover.length}
        />
      </Grid>
    )
  }

  if (isLoading) {
    return (
       <>
          <Loading />
       </>
    )
  }
  if (c === 'Name') {
    return (
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <div className="flex flex-col min-h-screen">
          <Container>
            <Divider sx={{ color: "secondary.light" }}>FILTER</Divider>
            <FilterBar query={q} category={c} prevGenres={g} prevDirectors={d} prevYears={year} prevSort={sort} />
            <Box p={5}>
              <Grid container spacing={4} justifyContent="center" wrap="wrap">
                {movies.slice((pageNum - 1) * 20, pageNum * 20).map(renderMovieCover)}
              </Grid>
            </Box>
            <Grid container justifyContent="center" >
              <Grid item>
                <Pagination
                  count={Math.ceil(movies.length / 20)}
                  color="secondary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{ m: 2 }}
                  page={pageNum}
                  onChange={handlePagination}
                />
              </Grid>
            </Grid>
          </Container>
        </div>
        <Footer />
      </div>
    )
  }
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <Container>
        <Divider sx={{ color: "secondary.light" }}>FILTER</Divider>
        <FilterBar query={q} category={c} prevGenres={g} prevDirectors={d} prevYears={year} prevSort={sort} />
        <Box p={5}>
          <Grid container spacing={4} justifyContent="center" wrap="wrap">
            {movies.map(renderMovieCover)}
          </Grid>
        </Box>
        <Grid container justifyContent="center" >
          <Grid item>
            <Pagination
              count={pageNum + 1}
              color="secondary"
              size="large"
              showFirstButton
              showLastButton
              sx={{ m: 2 }}
              page={pageNum} 
              onChange={handlePagination}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  )
}

export default SearchResults;