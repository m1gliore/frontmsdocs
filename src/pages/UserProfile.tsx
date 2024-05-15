import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Document, TaskNode} from "../types";
import axios from "axios";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useLocalStorage} from "react-use";
import {useNavigate} from "react-router-dom";

const Container = styled.div`
  display: flex;
  min-height: 76.3vh;
  background-color: rgb(255, 255, 255);
`

const Title = styled.h3`
  margin-left: .5vw;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 76.3vh;
  height: 76.3vh;
  width: 15vw;
  gap: 1.5vw;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 76.3vh;
  width: 85vw;
  border-left: .15vw solid rgb(0, 0, 0);
`

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vh;
  border-bottom: .15vw solid rgb(0, 0, 0);
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 63.5vh;
  gap: 5vw;
  margin-bottom: 2.5vw;
`

const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 2.5vw;
`

const Category = styled.p`
  margin: 0;
  font-size: 1.25rem;
  cursor: pointer;
`

const TasksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  gap: 2.5vw;
`

const Label = styled.label`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 1vw;
`

const Select = styled.select`
  appearance: none;
  border: 0;
  outline: 0;
  font: inherit;
  width: 20vw;
  padding: .5vw 5vw .5vw .5vw;
  background: url(https://upload.wikimedia.org/wikipedia/commons/9/9a/Caret_down_font_awesome.svg) no-repeat right 0.8em center / 1.4em,
  linear-gradient(to left, rgba(255, 255, 255, 0.3) 3em, rgba(255, 255, 255, 0.2) 3em);
  color: black;
  border-radius: 0.25vw;
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
`

const Button = styled.button`
  font-size: 1rem;
  border: none;
  background-color: rgb(96, 96, 218);
  color: rgb(255, 255, 255);
  width: 7.5vw;
  height: 5.5vh;
  border-radius: .5vw;
  cursor: pointer;
  transition: .5s ease-out;

  &:hover {
    transform: scale(1.1);
  }
`

const UserProfile: React.FC = () => {

    const [category, setCategory] = useState<string>("")
    const [documents, setDocuments] = useState<Array<Document>>([])
    const [selectedDocument, setSelectedDocument] = useState<string>("")
    const [taskNodesInWait, setTaskNodesInWait] = useState<Array<TaskNode>>([])
    const [taskNodesInExecute, setTaskNodesInExecute] = useState<Array<TaskNode>>([])
    const [taskNodesInDone, setTaskNodesInDone] = useState<Array<TaskNode>>([])
    const [user, setUser] = useLocalStorage("user")
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            await axios.get("http://localhost:8080/api/documents/getAll_documents")
                .then((res) => setDocuments(res.data))
            await axios.get(`http://localhost:8080/api/nodes/wait-task-nodes/${JSON.parse(user as string).id}`)
                .then((res) => {
                    console.log(res.data)
                    setTaskNodesInWait(res.data.content)
                })
            await axios.get(`http://localhost:8080/api/nodes/execute/${JSON.parse(user as string).id}`)
                .then((res) => {
                    console.log(res.data)
                    setTaskNodesInExecute(res.data.content)
                })
            await axios.get(`http://localhost:8080/api/nodes/done-task-nodes/${JSON.parse(user as string).id}`)
                .then((res) => {
                    setTaskNodesInDone(res.data.content)
                })
        })()
    }, [category, selectedDocument, user])

    const onChangeDocument = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        setSelectedDocument(selectedValue)
    }

    return (
        <Container>
            <LeftContainer>
                <Title>Пользователь: {JSON.parse(user as string)?.username}</Title>
                <Button style={{backgroundColor: "red"}} onClick={() => {
                    setUser("")
                    navigate("/home")
                    navigate(0)
                }}>Выйти с аккаунта</Button>
            </LeftContainer>
            <RightContainer>
                <TopContainer>
                    <Label>
                        <Select onChange={onChangeDocument}>
                            <option value="">Выберите документ</option>
                            {documents?.map((document, index) => (
                                <option key={index} value={document.idDocument}>{document.fileName}</option>
                            ))}
                        </Select>
                    </Label>
                </TopContainer>
                <BottomContainer>
                    <CategoryContainer>
                        <Category onClick={() => setCategory("waiting")}>Ожидающие задания</Category>
                        <Category onClick={() => setCategory("executing")}>Выполняющиеся задания</Category>
                        <Category onClick={() => setCategory("complete")}>Выполненные задания</Category>
                    </CategoryContainer>
                    <TasksContainer>
                        <TableContainer style={{display: category !== "waiting" ? "none" : "flex"}} sx={{width: 330}}
                                        component={Paper}>
                            <Table sx={{width: 330}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Задача</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taskNodesInWait.map((taskNode, index) => (
                                        <TableRow key={index}
                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell align="center" component="th" scope="row">
                                                {taskNode.name_node}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer style={{display: category !== "executing" ? "none" : "flex"}} sx={{width: 330}}
                                        component={Paper}>
                            <Table sx={{width: 330}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Задача</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taskNodesInExecute.map((taskNode, index) => (
                                        <TableRow key={index}
                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell align="center" component="th" scope="row">
                                                {taskNode.name_node}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer style={{display: category !== "complete" ? "none" : "flex"}} sx={{width: 330}}
                                        component={Paper}>
                            <Table sx={{width: 330}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Задача</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taskNodesInDone.map((taskNode, index) => (
                                        <TableRow key={index}
                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell align="center" component="th" scope="row">
                                                {taskNode.name_node}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TasksContainer>
                </BottomContainer>
            </RightContainer>
        </Container>
    )
}

export default UserProfile
