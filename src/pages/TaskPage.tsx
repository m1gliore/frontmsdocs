import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Modal from "../components/Modal";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {DecodedToken, Document, Employee, Task, TaskName, TaskNode} from "../types";
import {useLocalStorage} from "react-use";
import {AddOutlined, DeleteOutlined, EditOutlined, SettingsOutlined} from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 70vh;
  background-color: rgb(255, 255, 255);
  gap: 2.5vw;
  padding: 1.5vw;
`

const MainContainer = styled.div`
  display: flex;
  width: 100%;
`

const SettingsContainer = styled.div`
  position: absolute;
  top: 2vw;
  left: 2vw;
  display: flex;
  width: fit-content;
  padding: .5vw;
  border: .1vw solid rgba(128, 128, 128, .1);
  border-radius: .5vw;
  background-color: rgba(128, 128, 128, .1);
`

const Settings = styled(SettingsOutlined)`
  cursor: pointer;
`

const Edit = styled(EditOutlined)`
  margin-right: .5vw;
  cursor: pointer;
`

const Add = styled(AddOutlined)`
  margin-right: .5vw;
  cursor: pointer;
`

const Delete = styled(DeleteOutlined)`
  cursor: pointer;
`

const Title = styled.h1``

const TasksContainer = styled.div`
  width: 50%;
  border-left: .1vw solid black;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 2.5vw;
`

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`

const Form = styled.form`
  display: flex;
`

const LeftFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 1.25vw;
  gap: 1.5vw;
  border-right: .25vw solid rgb(0, 0, 0);
`

const RightFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 1.25vw;
  gap: 1.5vw;
`

const Label = styled.label`
  flex: 1;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 1vw;
`

const Input = styled.input`
  padding: 5px;
  width: 25vw;
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

const MultiSelect = styled.select`
  padding: 5px;
  width: 25vw;
  white-space: nowrap;
  overflow: auto;
  word-wrap: normal;
`

const Button = styled.button`
  font-size: 1rem;
  border: none;
  background-color: rgb(96, 96, 218);
  color: rgb(255, 255, 255);
  width: 10vw;
  height: 5vh;
  border-radius: .5vw;
  cursor: pointer;
  transition: .5s ease-out;

  &:hover {
    transform: scale(1.1);
  }
`

const TaskPage: React.FC = () => {

    const [modalActive, setModalActive] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<Array<string>>([])
    const {register, handleSubmit} = useForm()
    const [documents, setDocuments] = useState<Array<Document>>([])
    const [employees, setEmployees] = useState<Array<Employee>>([])
    const [selectedDocument, setSelectedDocument] = useState<string>("")
    const [tasksInWait, setTasksInWait] = useState<Array<Task>>([])
    const [taskNodesInExecute, setTaskNodesInExecute] = useState<Array<TaskNode>>([])
    const navigate = useNavigate()
    const [, setDocumentData] = useLocalStorage('documentData', '')
    const [tasksInDone, setTasksInDone] = useState<Array<Task>>([])
    const [currentWindow, setCurrentWindow] = useState<string>("")
    const [settingsVisibility, setSettingsVisibility] = useState<boolean>(false)
    const [admin, setAdmin] = useState<boolean>(false)
    const [user,] = useLocalStorage<string>("user")
    const [taskNames, setTaskNames] = useState<Array<TaskName>>([])

    useEffect(() => {

        if (user) {
            const decodedToken = jwtDecode(JSON.parse(user).token) as DecodedToken
            setAdmin(decodedToken.isAdmin)
        }
        (async () => {
            await axios.get("http://localhost:8080/api/documents/getAll_documents")
                .then((res) => {
                    setDocuments(res.data)
                })
            await axios.get("http://localhost:8080/api/employees/getEmployeesFromPage")
                .then((res) => {
                    setEmployees(res.data.content)
                })
            await axios.get(`http://localhost:8080/api/nodes/execute/${JSON.parse(user as string).id}`)
                .then((res) => {
                    setTaskNodesInExecute(res.data.content)
                })
        })()

    }, [user])

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValues = Array.from(event.target.selectedOptions, (option: HTMLOptionElement) => option.value)
        setSelectedOptions(selectedValues)

        const initialTaskNames = selectedValues.map((employeeId) => ({employeeId, taskName: ''}))
        setTaskNames(initialTaskNames)
    }

    const handleTaskNameChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTaskNames = [...taskNames]
        updatedTaskNames[index].taskName = event.target.value
        setTaskNames(updatedTaskNames)
    }

    const onChangeDocument = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        setSelectedDocument(selectedValue)
        if (selectedValue !== "") {
            admin &&
            axios.get(`http://localhost:8080/api/tasks/document/${selectedValue}/wait`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .then((res) => {
                    setTasksInWait(res.data.content)
                })
            admin &&
            axios.get(`http://localhost:8080/api/tasks/document/${selectedValue}/notAcceptedDone`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .then((res) => {
                    setTasksInDone(res.data.content)
                })
        }
    }

    const addTask: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData()
        formData.append("nameTask", data.nameTask)
        formData.append("comment", data.comment)
        // @ts-ignore
        formData.append("id_employee", selectedOptions.map(Number))
        // @ts-ignore
        formData.append("id_employee_creator", JSON.parse(user as string)?.id)
        // @ts-ignore
        formData.append("id_document", parseInt(data.document, 10))

        const nodeNames = taskNames.map(task => task.taskName)

        // @ts-ignore
        formData.append("node_name", nodeNames)
        // @ts-ignore
        formData.append("name_desc", Array(selectedOptions.length).fill('mama'))

        await axios.post('http://localhost:8080/api/tasks/create', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        }).then(() => navigate(0))
    }

    const updateTask: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData()
        // @ts-ignore
        formData.append("idTask", parseInt(data.idTask, 10))
        formData.append("nameTask", data.nameTaskUpdate)
        formData.append("comment", data.commentUpdate)
        // @ts-ignore
        formData.append("id_employee", selectedOptions.map(Number))
        // @ts-ignore
        formData.append("id_employee_creator", JSON.parse(user as string)?.id)

        const nodeNames = taskNames.map(task => task.taskName)

        // @ts-ignore
        formData.append("node_name", nodeNames)
        // @ts-ignore
        formData.append("name_desc", Array(selectedOptions.length).fill('mama'))

        await axios.put('http://localhost:8080/api/tasks/update', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        }).then(() => navigate(0))
    }

    const deleteTask: SubmitHandler<FieldValues> = async (data) => {
        const idTask = data.idTaskDelete

        await axios.delete(`http://localhost:8080/api/tasks/${idTask}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        }).then(() => navigate(0))
    }

    const startTask = async (id: number) => {
        await axios.get(`http://localhost:8080/api/tasks/start/${id}/document/${selectedDocument}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        }).then(() => {
            navigate(0)
        })
    }

    const finishTask = async (id: number) => {
        await axios.post(`http://localhost:8080/api/tasks/finish/${id}/document/${selectedDocument}`, {}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        }).then(() => {
            alert("Задача завершена. Все подписи проверены!")
            navigate(0)
        })
    }

    const startTaskNode = async (id: number) => {
        await axios.get(`http://localhost:8080/api/nodes/start/${id}`).then((res) => {
            setDocumentData(JSON.stringify({
                fileDirectory: res.data.fileDirectory,
                fileName: res.data.fileName,
                file_in_byte: atob(res.data.file_in_byte),
                id
            }))
            alert("Вы приняли задание. Все предыдущие подписи проверены!")
            navigate("/documents")
            navigate(0)
        })
    }

    return (
        <Container>
            {admin &&
                <SettingsContainer onMouseOver={() => setSettingsVisibility(true)}
                                   onMouseOut={() => setSettingsVisibility(false)}>
                    <Settings style={{display: settingsVisibility ? "none" : "block"}} fontSize="large"/>
                    <Tooltip title="Добавить задачу" placement="bottom">
                        <Add style={{display: settingsVisibility ? "block" : "none"}} fontSize="large" onClick={() => {
                            setModalActive(true)
                            setCurrentWindow("create")
                        }}/>
                    </Tooltip>
                    <Tooltip title="Изменить задачу" placement="bottom">
                        <Edit style={{display: settingsVisibility ? "block" : "none"}} fontSize="large" onClick={() => {
                            setModalActive(true)
                            setCurrentWindow("update")
                        }}/>
                    </Tooltip>
                    <Tooltip title="Удалить задачу" placement="bottom">
                        <Delete style={{display: settingsVisibility ? "block" : "none"}} fontSize="large"
                                onClick={() => {
                                    setModalActive(true)
                                    setCurrentWindow("delete")
                                }}/>
                    </Tooltip>
                </SettingsContainer>
            }
            <Title>Ваши задачи</Title>
            <MainContainer>
                <Label style={{
                    display: "flex",
                    justifyContent: "center",
                    borderRight: ".1vw solid black",
                    alignItems: "flex-start"
                }}>
                    <Select onChange={onChangeDocument}>
                        <option value="">Выберите документ</option>
                        {documents?.map((document, index) => (
                            <option key={index} value={document.idDocument}>{document.fileName}</option>
                        ))}
                    </Select>
                </Label>
                <TasksContainer>
                    <TableContainer sx={{width: 330}}
                                    component={Paper}>
                        <Table sx={{width: 330}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Задача</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasksInWait.map((task, index) => (
                                    <TableRow key={index}
                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                              onClick={() => startTask(task.idTask)}
                                    >
                                        <TableCell sx={{cursor: "pointer"}}
                                                   align="center" component="th" scope="row">
                                            {task.nameTask} (ожид)
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {taskNodesInExecute.map((taskNode, index) => (
                                    <TableRow key={index}
                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                              onClick={() => startTaskNode(taskNode.idSequentialTaskNode)}
                                    >
                                        <TableCell
                                            sx={{cursor: "pointer"}} align="center" component="th" scope="row">
                                            {taskNode.name_node}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tasksInDone.map((task, index) => (
                                    <TableRow key={index}
                                              sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                              onClick={() => finishTask(task.idTask)}
                                    >
                                        <TableCell sx={{cursor: "pointer"}}
                                                   align="center" component="th" scope="row">
                                            {task.nameTask} (готов)
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TasksContainer>
            </MainContainer>
            <Modal active={modalActive} setActive={setModalActive}>
                <ModalContainer style={{display: currentWindow !== "create" ? "none" : "flex"}}>
                    <Title>Создать задачу</Title>
                    <Form onSubmit={handleSubmit(addTask)}>
                        <LeftFormContainer>
                            <Input type="text" {...register("nameTask")} placeholder="Задача"/>
                            <Input type="text" {...register("comment")} placeholder="Комментарий"/>
                            <Label style={{flexDirection: "column"}}>
                                Сотрудники:
                                <MultiSelect multiple name="employee" onChange={handleSelectChange}>
                                    {employees?.map((employee, index) => (
                                        <option key={index}
                                                value={employee.idEmployee}>{employee.surname + " " + employee.name + " " + employee.patronymic}</option>
                                    ))}
                                </MultiSelect>
                            </Label>
                        </LeftFormContainer>
                        <RightFormContainer>
                            {taskNames.map((task, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    placeholder={`Название подзадачи для пользователя ${task.employeeId}`}
                                    value={task.taskName}
                                    onChange={(event) => handleTaskNameChange(index, event)}
                                />
                            ))}
                            <Label>
                                <Select style={{width: "25vw"}} {...register("document")}>
                                    <option value="">Выберите документ</option>
                                    {documents?.map((document, index) => (
                                        <option key={index} value={document.idDocument}>{document.fileName}</option>
                                    ))}
                                </Select>
                            </Label>
                            <Button type="submit">Создать</Button>
                        </RightFormContainer>
                    </Form>
                </ModalContainer>
                <ModalContainer style={{display: currentWindow !== "update" ? "none" : "flex"}}>
                    <Title>Изменить задачу</Title>
                    <Form onSubmit={handleSubmit(updateTask)}>
                        <LeftFormContainer>
                            <Select {...register("idTask")}>
                                <option value="">Выберите задачу</option>
                                {tasksInWait?.map((task, index) => (
                                    <option key={index} value={task.idTask}>{task.nameTask}</option>
                                ))}
                            </Select>
                            <Input type="text" {...register("nameTaskUpdate")} placeholder="Задача"/>
                            <Input type="text" {...register("commentUpdate")} placeholder="Комментарий"/>
                            <Label>
                                Сотрудники:
                                <MultiSelect style={{flexDirection: "column"}} multiple onChange={handleSelectChange}>
                                    {employees?.map((employee, index) => (
                                        <option key={index}
                                                value={employee.idEmployee}>{employee.surname + " " + employee.name + " " + employee.patronymic}</option>
                                    ))}
                                </MultiSelect>
                            </Label>
                        </LeftFormContainer>
                        <RightFormContainer>
                            {taskNames.map((task, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    placeholder={`Название подзадачи для пользователя ${task.employeeId}`}
                                    value={task.taskName}
                                    onChange={(event) => handleTaskNameChange(index, event)}
                                />
                            ))}
                            <Button type="submit">Изменить</Button>
                        </RightFormContainer>
                    </Form>
                </ModalContainer><ModalContainer style={{display: currentWindow !== "delete" ? "none" : "flex"}}>
                <Title>Удалить задачу</Title>
                <Form onSubmit={handleSubmit(deleteTask)}>
                    <RightFormContainer>
                        <Select style={{marginBottom: "2vw"}} {...register("idTaskDelete")}>
                            <option value="">Выберите задачу</option>
                            {tasksInWait?.map((task, index) => (
                                <option key={index} value={task.idTask}>{task.nameTask}</option>
                            ))}
                        </Select>
                        <Button type="submit">Удалить</Button>
                    </RightFormContainer>
                </Form>
            </ModalContainer>
            </Modal>
        </Container>
    )
}

export default TaskPage
