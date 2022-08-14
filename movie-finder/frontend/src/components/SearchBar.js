import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Button,
  Container,
  TextField,
} from '@mui/material';

function createSearchQuery (query, category) {
  let searchQuery = '/search?q=' + query + '&c=' + category;
  return searchQuery;
}

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

const SearchBar = (props) => {
  const {prevQuery, prevCategory} = props
  // console.log(prevCategory)
  const [query, setQuery] = useState(!prevQuery ? '' : prevQuery);
  const [category, setCategory] = useState(!prevCategory ? 'Name' : prevCategory);
  const navigate = useNavigate();
  const getSearchResults = (query, category) => navigate(createSearchQuery(query, category));

  return (
    <>
      <Container>
        {/* <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}> */}
        <Grid container spacing={2} alignItems="center">
          {/* <Grid item xs={2}> */}
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              id="category"
              select
              value={category}
              label="Category"
              variant="outlined"
              margin="normal"
              color="secondary"
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              // style = {{width: "15%"}}
            >
              {/* <MenuItem value="All">All Categories</MenuItem> */}
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="Genre">Genre</MenuItem>
              <MenuItem value="Cast">Cast</MenuItem>
              <MenuItem value="Year">Year</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={7} md={9}>
            <TextField
              id="Query"
              value={query}
              label="Search..."
              variant="outlined"
              margin="normal"
              color="primary"
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              // style = {{width: "50%"}}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={1}>
            <Button
              id="update-button"
              variant="contained"
              color="primary"
              onClick={() => getSearchResults(query, category)}
              fullWidth
              // style = {{width: "10%"}}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        {/* </Box> */}
      </Container>
    </>
  )
}

export default SearchBar;