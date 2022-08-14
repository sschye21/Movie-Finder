import React from 'react'

export default function TotalRatings (props) {

    const {one, two, three, four, five} = props
    const ratingTotal = [five, four, three, two, one]

    return (
        <div className="pb-12 -mt-4">
            {ratingTotal.map((item, count) => {
                return (
                    <div className="flex items-center mt-4" key={count}>
                        <span className="text-sm font-medium text-blue-500">{5-count} star</span>
                        <div className="w-2/4 h-5 mx-4 bg-gray-300 rounded dark:bg-gray-700">
                            <div className="bg-yellow-400 h-5 rounded ease-in-out transition-all" style={{width: item}}></div>
                        </div>
                        <span className="text-sm font-medium text-blue-500">{item}</span>
                    </div>
                )
            })}
        </div>
    )
}