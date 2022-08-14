import React from 'react';
import Carousel from 'react-grid-carousel';
import MovieCover from './MovieCover';

function Wishlist(props) {
  const {items, isUser, userName} = props

  const wishlistData = items.sort((a,b) => (a.movie_id > b.movie_id) ? 1 : ((b.movie_id > a.movie_id) ? -1 : 0))

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

  const emptyMessage = () => {return isUser ? 'Your wishlist is empty. Search movies to get started' : `${userName}'s wishlist is empty`}

  return (
    <div className='px-12'>
      <p className="text-3xl pt-16 pb-8">Wishlist</p>
      {items.length !== 0 ? 
        <Carousel cols={4} rows={1} gap={20} showDots={true} loop mobileBreakpoint={0}
        responsiveLayout={[
            {breakpoint: 1000, cols: 3},
            {breakpoint: 700, cols: 2},
            {breakpoint: 500, cols: 1}
        ]}>
          {wishlistData.map(renderMovieCover)}
        </Carousel> 
      : 
        <div className="text-center">
          <p>{emptyMessage()}</p>
        </div>
      }
    </div>
  );
}

export default Wishlist;