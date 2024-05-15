import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import DocumentPage from "./pages/DocumentPage";
import UserProfile from "./pages/UserProfile";
import styled from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskPage from "./pages/TaskPage";
import AdminProfile from "./pages/AdminProfile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import {useLocalStorage} from "react-use";
import jwtDecode from "jwt-decode";
import {DecodedToken} from "./types";

const Wrapper = styled.div``

const App: React.FC = () => {

    const [admin, setAdmin] = useState<boolean>(false)
    const [user,] = useLocalStorage<string>("user")

    useEffect(() => {
        if (user !== "") {
            const decodedToken = jwtDecode(JSON.parse(user as string).token) as DecodedToken
            setAdmin(decodedToken.isAdmin)
        }
    }, [user])

    return (
        <Wrapper>
            <Router>
                <Header/>
                <Routes>
                    <Route path="/" element={<WelcomePage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    {user !== "" && <Route path="/documents" element={<DocumentPage/>}/>}
                    {user !== "" ? (
                        admin ? (
                            <Route path="/profile/admin" element={<AdminProfile/>}/>
                        ) : (
                            <Route path="/profile/user" element={<UserProfile/>}/>
                        )
                    ) : null}
                    {user !== "" && <Route path="/tasks" element={<TaskPage/>}/>}
                    {user === "" && <Route path="/signin" element={<Login/>}/>}
                    {user === "" && <Route path="/signup" element={<Registration/>}/>}
                </Routes>
                <Footer/>
            </Router>
        </Wrapper>
    )
}

export default App
