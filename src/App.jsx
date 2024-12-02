import React from "react";
import FormProfile from './FormProfile';
import { UserCard } from './Profile';
import { BrowserRouter as Routers, Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <>
            <Routers>
                <Routes>
                    <Route path='/' element={<FormProfile />} />
                    <Route path='/Profile' element={<UserCard />} />
                </Routes>
            </Routers>

        </>
    )
}

export default App;