import React from 'react'
import { RiStarSFill,  RiStarSLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'

export default function Stars (props) {

    const { filled } = props;
    const remaining = 5 - parseInt(filled)

    return (
        <div className='flex flex-row'>
            <IconContext.Provider value={{ color: "yellow", className: "global-class-name" }}>
                {[...Array(filled)].map((e, i) =>
                    <RiStarSFill key={i}/>
                )}
            </IconContext.Provider>
            <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
                {[...Array(remaining)].map((e, i) =>
                    <RiStarSLine key={i}/>
                )}
            </IconContext.Provider>
        </div>
    )
}