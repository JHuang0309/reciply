import { useState } from 'react'
import { useNavigate  } from 'react-router-dom'; 

function LandingPage() {

    const navigate = useNavigate();

    const buttonHandle = () => {
        navigate('/reciply');
    }

    return (
        <>
        Welcome to Reciply
        <button onClick={buttonHandle}>Go to main page</button>
        </>
    );
}

export default LandingPage;