import React from 'react'
import Carousel from 'react-grid-carousel';
import MovieCover from './MovieCover';

export default function SimilarMovies ({ similarMovieData }) {
    return (
        <div className="text-white px-4">
            <p className="text-3xl pl-8 pb-12 pt-12 lg:pt-0 md:pt-0">Similar Movies</p>
            <div className='max-w-6xl items-center'>
                <Carousel cols={4} rows={1} gap={20} showDots={true} loop mobileBreakpoint={0}
                    responsiveLayout={[
                        {breakpoint: 1000, cols: 3},
                        {breakpoint: 700, cols: 2},
                        {breakpoint: 500, cols: 1}
                    ]}>
                    {similarMovieData.map((cover, index) => {
                        return (
                            <Carousel.Item key={index}>
                                <MovieCover
                                    movie_id={cover.movie_id}
                                    image_url={cover.imageUrl}
                                    title={cover.title}
                                    description={cover.description}
                                    year={cover.year}
                                    rating={cover.rating}
                                    length={cover.length}
                                    reloadReq={true}
                                />
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            </div>
        </div>
    )
}