import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, Chip, Container, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 500,
      // width: 250,
    },
  },
};

// Maybe filter by star rating, language,?

const genres = [
  'Action',
  'Adventure',
  'Adult',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Game-Show',
  'History',
  'Horror',
  'Mystery',
  'Music',
  'Musical',
  'News',
  'Reality-TV',
  'Romance',
  'Sci-Fi',
  'Short',
  'Sport',
  'Talk-Show',
  'Thriller',
  'War',
  'Western',
];

const directorsList = [
  'Alfred Hitchcock',
  'Billy Wilder',
  'Charles Chaplin',
  'Christopher Nolan',
  'Clint Eastwood',
  'Danny Boyle',
  'David Fincher',
  'David Lean',
  'Francis Ford Coppola',
  'Ingmar Bergman',
  'James Cameron',
  'Joel Coen',
  'John Ford',
  'John Huston',
  'Martin Scorsese',
  'Milos Forman',
  'Peter Jackson',
  'Quentin Tarantino',
  'Ridley Scott',
  'Roman Polanski',
  'Sidney Lumet',
  'Stanley Kubrick',
  'Steven Spielberg',
  'Tim Burton',
  'Woody Allen',
];

const yearsList = [
  '>2020',
  '2010-2019',
  '2000-2009',
  '1990-1999',
  '1980-1989',
  '1970-1979',
  '1960-1969',
  '1950-1959',
  '<1950',
]

function createSearchFilterQuery (query, category, movieGenres, directors, years, sortBy) {
  let searchQuery = '/search?q=' + query + '&c=' + category + '&g=' + movieGenres + '&d=' + directors + '&year=' + years + '&sortBy=' + sortBy;
  console.log(searchQuery)
  return searchQuery;
}

const FilterBar = (props) => {
  const {query, category, prevGenres, prevDirectors, prevYears, prevSort} = props
  // const [genre, setGenre] = useState('');
  // console.log(prevGenres.split(','))
  // console.log(prevDirectors.split(','))
  const [movieGenres, setMovieGenres] = useState(!prevGenres ? [] : prevGenres.split(','));
  const [directors, setDirectors] = useState(!prevDirectors ? [] : prevDirectors.split(','));
  const [years, setYears] = useState(!prevYears ? [] : prevYears.split(','));
  // const [sortBy, setSortBy] = useState(!prevSortBy ? 'featured' : prevSortBy);
  const [sortBy, setSortBy] = useState(!prevSort ? 'featured' : prevSort.split(','));
  
  const handleGenresChange = (event) => {
    const {
      target: { value },
    } = event;
    setMovieGenres(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleDirectorsChange = (event) => {
    const {
      target: { value },
    } = event;
    setDirectors(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleYearsChange = (event) => {
    const {
      target: { value },
    } = event;
    setYears(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const navigate = useNavigate();
  const getFilterResults = (query, category, movieGenres, directors, years, sortBy) => navigate(createSearchFilterQuery(query, category, movieGenres, directors, years, sortBy));
  
  return (
    <>
      <Container>
        <Grid container spacing={2} alignItems="center">
          {/* <Grid item xs={1}>
            <IconButton aria-label="play/pause">
              <FilterListIcon select sx={{ height: 38, width: 38 }} />
            </IconButton>
          </Grid> */}
          <Grid item xs={6} sm={2.5} md={2.5}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Genre</InputLabel>
              <Select
                // select
                multiple
                // labelId="demo-simple-select-label"
                id="genre"
                value={movieGenres}
                // label="Genre"
                // fullWidth
                input={<OutlinedInput label="Genre" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                onChange={handleGenresChange}
                MenuProps={MenuProps}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    <Checkbox checked={movieGenres.indexOf(genre) > -1} />
                    <ListItemText primary={genre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2.5} md={2.5}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Director</InputLabel>
              <Select
                // select
                multiple
                // labelId="demo-simple-select-label"
                id="director"
                value={directors}
                label="Director"
                // fullWidth
                input={<OutlinedInput label="Director" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                onChange={handleDirectorsChange}
                MenuProps={MenuProps}
              >
                {directorsList.map((director) => (
                  <MenuItem key={director} value={director}>
                    <Checkbox checked={directors.indexOf(director) > -1} />
                    <ListItemText primary={director} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2.5} md={2.5}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Year</InputLabel>
              <Select
                // select
                multiple
                // labelId="demo-simple-select-label"
                id="year"
                value={years}
                label="Year"
                // fullWidth
                input={<OutlinedInput label="Year" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                onChange={handleYearsChange}
                MenuProps={MenuProps}
              >
                {yearsList.map((year) => (
                  <MenuItem key={year} value={year}>
                    <Checkbox checked={years.indexOf(year) > -1} />
                    <ListItemText primary={year} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2.5} md={2.5}>
            <TextField
              select
              // labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortBy}
              label="Sort By"
              fullWidth
              // MenuProps={MenuProps}
              // borderRadius= '50%'
              onChange={(e) => setSortBy(e.target.value)}
              // director, year
            >
              <MenuItem value='featured'>Featured</MenuItem>
              <MenuItem value='rating'>Rating</MenuItem>
              <MenuItem value='alphabetUp'>Alphabetical: Ascending</MenuItem>
              <MenuItem value='alphabetDown'>Alphabetical: Descending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2} md={2}>
            <Button
              id="update-button"
              variant="contained"
              color="secondary"
              onClick={() => getFilterResults(query, category, movieGenres, directors, years, sortBy)}
              fullWidth
              // style = {{width: "10%"}}
            >
              Sort {'&'} Filter
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default FilterBar;