import React, { useEffect, useState } from 'react'
// import loading from "../images/loader.webp"
import { useSelector } from 'react-redux'

function Loader() {
    const isLoading = useSelector((state) => state.isLoading.status)
    const [loader,setLoader] = useState(isLoading);
    return (
        <div className={isLoading ? 'Loader' : 'displayNone'}>
            {/* <img className='loading' src={loading} alt="loading" /> */}
            <span class="loader"></span>
        </div>
    )
}

export default Loader