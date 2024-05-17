import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {PersonOutlineOutlined, SsidChartOutlined, TaskAltOutlined} from "@mui/icons-material";
import {CustomTooltipProps, Document, Task, User} from "../types";
import axios from "axios";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts';
import {useLocalStorage} from "react-use";
import {useNavigate} from "react-router-dom";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Modal from "../components/Modal";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";

const Container = styled.div`
  display: flex;
  min-height: 76.3vh;
  background-color: rgb(255, 255, 255);
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 76.3vh;
  height: 76.3vh;
  width: 15vw;
  gap: 1.5vw;
  padding: .5vw;
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

const Title = styled.h3`
  margin-left: .5vw;
`

const Button = styled.button`
  font-size: 1rem;
  border: none;
  background-color: rgb(96, 96, 218);
  color: rgb(255, 255, 255);
  width: 8.5vw;
  height: 5.5vh;
  border-radius: .5vw;
  cursor: pointer;
  transition: .5s ease-out;

  &:hover {
    transform: scale(1.1);
  }
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
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  gap: 2.5vw;
`

const GraphsContainer = styled.div`
  margin-top: 2.5vw;
  margin-left: 2.5vw;
  width: 80vw;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const Graph = styled.div``

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

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5vw;
`

const Input = styled.input`
  padding: 5px;
  border-radius: .5vw;
  width: 15vw;
`

const UsersContainer = styled.div`
  margin-top: 1.5vw;
  margin-left: 1.5vw;
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
`

const UserCard = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const UserField = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserAction = styled.div`
  display: flex;
  gap: 1rem;
`

const UserProfile: React.FC = () => {

    const [category, setCategory] = useState<string>("waiting")
    const [panel, setPanel] = useState<string>("tasks")
    const [documents, setDocuments] = useState<Array<Document>>([])
    const [tasksInWait, setTasksInWait] = useState<Array<Task>>([])
    const [tasksInExecute, setTasksInExecute] = useState<Array<Task>>([])
    const [tasksInDone, setTasksInDone] = useState<Array<Task>>([])
    const [selectedDocument, setSelectedDocument] = useState<string>("")
    const [user, setUser] = useLocalStorage("user")
    const navigate = useNavigate()
    const [percentExecute, setPercentExecute] = useState<number>(0)
    const [allStatistic, setAllStatistic] = useState<Record<string, number>>({})
    const [percentRollBack, setPercentRollBack] = useState<number>(0)
    const [tasks, setTasks] = useState<Array<Task>>([])
    const [modalActive, setModalActive] = useState<boolean>(false)
    const {register, handleSubmit} = useForm()
    const [users, setUsers] = useState<User[]>([])
    const [editingUserId, setEditingUserId] = useState<number | null>(null)
    const [documentId, setDocumentId] = useState<number>(0)
    const [taskId, setTaskId] = useState<number>(0)
    const [userInfo, setUserInfo] = useState<User>()

    useEffect(() => {
        (async () => {
            await axios.get("http://localhost:8080/api/documents/getAll_documents")
                .then((res) => setDocuments(res.data))
            await axios.get("http://localhost:8080/api/tasks/wait", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .then((res) => {
                    setTasksInWait(res.data.content)
                })
            await axios.get("http://localhost:8080/api/tasks/execute", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .then((res) => {
                    setTasksInExecute(res.data.content)
                })
            await axios.get("http://localhost:8080/api/tasks/done", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .then((res) => {
                    setTasksInDone(res.data.content)
                })

            await axios.get("http://localhost:8080/api/tasks/all", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .then((res) => {
                    setTasks(res.data.content)
                })

            await axios.get("http://localhost:8080/api/users/getAll")
                .then((res) => {
                    setUsers(res.data)
                })

            await axios.get(`http://localhost:8080/api/users/${JSON.parse(user as string)?.id}`)
                .then((res) => {
                    setUserInfo(res.data)
                })
        })()
    }, [user])

    const idString = tasksInWait.map(task => task.idTask).join(',')

    const onChangeDocument = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        setDocumentId(Number(selectedValue))

        await axios.get(`http://localhost:8080/api/tasks/statistic/statistics/${selectedValue}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        })
            .then((res) => {
                setAllStatistic(res.data)
            })

        await axios.get(`http://localhost:8080/api/tasks/statistic/percent-rollback/${selectedValue}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        })
            .then((res) => {
                setPercentRollBack(res.data)
            })

        setSelectedDocument(selectedValue)
    }

    const onChangeTask = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        setTaskId(Number(selectedValue))

        await axios.get(`http://localhost:8080/api/tasks/statistic/percent-execute/${selectedValue}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        })
            .then((res) => {
                setPercentExecute(res.data)
            })

        setSelectedDocument(selectedValue)
    }

    const onChangePriority: SubmitHandler<FieldValues> = async (data) => {
        const idTaskUpdate = data.idTaskUpdate.split(",").map(Number)
        await axios.put(`http://localhost:8080/api/tasks/change-priority?id_document=${parseInt(data.idDocument, 10)}`, idTaskUpdate, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        }).then(() => navigate(0))
    }

    const percentExecuteData = [
        {name: "Выполнено", value: percentExecute * 100},
        {name: "Не выполнено", value: 100 - (percentExecute * 100)}
    ]

    const allStatisticData = Object.keys(allStatistic).map((key) => ({
        name: key,
        value: allStatistic[key] * 100
    }))

    const percentRollBackData = [
        {name: 'Откат', value: percentRollBack},
        {name: 'Осталось', value: 100 - percentRollBack}
    ]

    const CustomTooltip: React.FC<CustomTooltipProps> = ({active, payload}) => {
        if (active && payload && payload.length) {
            return (
                <div style={{background: 'white', border: '1px solid #ccc', padding: '10px'}}>
                    <p>{`${payload[0].name} : ${payload[0].value}`}</p>
                </div>
            )
        }

        return null
    }

    const rollBackTask = async (id: number) => {
        await axios.post(`http://localhost:8080/api/tasks/rollback/${id}/document/${selectedDocument}`, {}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(user as string)?.token}`
            }
        })
            .then((res) => {
                setPercentRollBack(res.data)
                navigate(0)
            })
    }

    const addUser = async (data: any) => {
        try {
            const newUser = {
                password: data.password,
                employeeDTO: {
                    surname: data.surname,
                    name: data.name,
                    patronymic: data.patronymic
                },
                username: data.username,
                isActive: true
            }
            await axios.post("http://localhost:8080/api/users/create", newUser)
                .then(() => navigate(0))
        } catch (error) {
            alert(`Ошибка при добавлении пользователя: ${error}`)
        }
    }

    const blockUser = async (userId: number) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${userId}/block`, {})
                .then(() => navigate(0))
        } catch (error) {
            alert(`Ошибка при блокировке пользователя: ${error}`);
        }
    }

    const activateUser = async (userId: number) => {
        try {
            await axios.put(`http://localhost:8080/api/users/${userId}/unblock`, {})
                .then(() => navigate(0))
        } catch (error) {
            alert(`Ошибка при активации пользователя: ${error}`);
        }
    }

    const startEditingUser = (userId: number) => {
        setEditingUserId(userId);
    };

    const cancelEditingUser = () => {
        setEditingUserId(null);
    };

    const submitEditUser = async (userId: number, data: any) => {
        await editUser(userId, data);
        cancelEditingUser();
    };

    const editUser = async (userId: number, data: any) => {
        try {
            const userToUpdate = users.find(user => user.idUser === userId);
            if (!userToUpdate) {
                throw new Error('Пользователь не найден');
            }

            const newUser = {
                idUser: userId,
                employeeDTO: {
                    surname: data[`surname_${userId}`],
                    name: data[`name_${userId}`],
                    patronymic: data[`patronymic_${userId}`]
                },
                username: data[`username_${userId}`],
                password: userToUpdate.password
            };
            await axios.put(`http://localhost:8080/api/users/update`, newUser)
                .then(() => navigate(0))
        } catch (error) {
            alert(`Ошибка при редактировании пользователя: ${error}`);
        }
    };

    const createReport = async () => {
        try {
            const response = await axios.create({
                headers: {
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            })
                .put(`http://localhost:8080/api/tasks/statistic/report/${taskId}/${documentId}`,
                    {})
                .then(() => navigate(0))
        } catch (error) {
            alert(error)
        }
    };

    return (
        <Container>
            <LeftContainer>
                <Title>Пользователь: {userInfo?.employeeDTO.surname + " " + userInfo?.employeeDTO.name + " "
                    + userInfo?.employeeDTO.patronymic + "\nИмя пользователя: " + userInfo?.username}</Title>
                Задачи
                <TaskAltOutlined style={{cursor: "pointer"}} fontSize="large" onClick={() => setPanel("tasks")}/>
                Статистика
                <SsidChartOutlined style={{cursor: "pointer"}} fontSize="large" onClick={() => setPanel("graphs")}/>
                Пользователи
                <PersonOutlineOutlined style={{cursor: "pointer"}} fontSize="large" onClick={() => setPanel("users")}/>
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
                    <Label style={{marginLeft: "2.5vw"}}>
                        <Select onChange={onChangeTask}>
                            <option value="">Выберите задачу</option>
                            {tasks?.map((task, index) => (
                                <option key={index} value={task.idTask}>{task.nameTask}</option>
                            ))}
                        </Select>
                    </Label>
                </TopContainer>
                <BottomContainer>
                    <CategoryContainer style={{display: panel !== "tasks" ? "none" : "flex"}}>
                        <Category onClick={() => setCategory("waiting")}>Ожидающие задания</Category>
                        <Category onClick={() => setCategory("executing")}>Выполняющиеся задания</Category>
                        <Category onClick={() => setCategory("complete")}>Выполненные задания</Category>
                    </CategoryContainer>
                    <TasksContainer style={{display: panel !== "tasks" ? "none" : "flex"}}>
                        <TableContainer style={{display: category !== "waiting" ? "none" : "flex"}} sx={{width: 950}}
                                        component={Paper}>
                            <Table sx={{width: 950}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Задача</TableCell>
                                        <TableCell>Подзадачи</TableCell>
                                        <TableCell>Выполнят</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasksInWait.map((task, index) => (
                                        <TableRow key={index}
                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell component="th" scope="row">
                                                {task.nameTask}
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    {task.sequentialTaskNodeDTOS.map((taskNode, index) => (
                                                        <li key={index}>{taskNode.name_node}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    {task.employees.map((employee, index) => (
                                                        <li key={index}>{employee.surname + " " + employee.name + " " + employee.patronymic}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer style={{display: category !== "executing" ? "none" : "flex"}} sx={{width: 950}}
                                        component={Paper}>
                            <Table sx={{width: 950}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Задача</TableCell>
                                        <TableCell>Подзадачи</TableCell>
                                        <TableCell>Выполняют</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasksInExecute.map((task, index) => (
                                        <TableRow key={index}
                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                            <TableCell component="th" scope="row">
                                                {task.nameTask}
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    {task.sequentialTaskNodeDTOS.map((taskNode, index) => (
                                                        <li key={index}>{taskNode.name_node}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    {task.employees.map((employee, index) => (
                                                        <li key={index}>{employee.surname + " " + employee.name + " " + employee.patronymic}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer style={{display: category !== "complete" ? "none" : "flex"}} sx={{width: 950}}
                                        component={Paper}>
                            <Table sx={{width: 950}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Задача</TableCell>
                                        <TableCell>Подзадачи</TableCell>
                                        <TableCell>Выполнили</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasksInDone.map((task, index) => (
                                        <TableRow style={{cursor: "pointer"}} key={index}
                                                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                  onClick={() => rollBackTask(task.idTask)}
                                        >
                                            <TableCell component="th" scope="row">
                                                {task.nameTask}
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    {task.sequentialTaskNodeDTOS.map((taskNode, index) => (
                                                        <li key={index}>{taskNode.name_node}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                            <TableCell>
                                                <ul>
                                                    {task.employees.map((employee, index) => (
                                                        <li key={index}>{employee.surname + " " + employee.name + " " + employee.patronymic}</li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button style={{display: category !== "waiting" ? "none" : "flex"}} onClick={() => {
                            setModalActive(true)
                        }}>Смена приоритета задач</Button>
                    </TasksContainer>
                    <GraphsContainer style={{display: panel !== "graphs" ? "none" : "flex"}}>
                        <Graph>
                            <h2>Процент выполнения</h2>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={percentExecuteData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {
                                        percentExecuteData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "#0088FE" : "#00C49F"}/>
                                        ))
                                    }
                                </Pie>
                                <Tooltip content={<CustomTooltip/>}/>
                            </PieChart>
                        </Graph>
                        <Graph>
                            <h2>Статистика задач</h2>
                            <BarChart width={400} height={300} data={allStatisticData}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="value" fill="#8884d8"/>
                            </BarChart>
                            <Button style={{marginTop: "2.5vw"}} onClick={createReport}>Создать отчёт</Button>
                        </Graph>
                        <Graph>
                            <h2>Процент отката</h2>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={percentRollBackData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {
                                        percentRollBackData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? "#FF8042" : "#00C49F"}/>
                                        ))
                                    }
                                </Pie>
                                <Tooltip content={<CustomTooltip/>}/>
                            </PieChart>
                        </Graph>
                    </GraphsContainer>
                    <UsersContainer style={{display: panel !== "users" ? "none" : "flex"}}>
                        <h2>Управление пользователями</h2>
                        {/* Пример карточки пользователя */}
                        {users?.map((user, index) => (
                            // Добавляем кнопки в компонент UserCard
                            <UserCard key={index}>
                                <UserField>
                                    {editingUserId === user.idUser ? (
                                        <Form onSubmit={handleSubmit((data) => submitEditUser(user.idUser, data))}>
                                            <Input {...register(`surname_${user.idUser}`)} defaultValue={user.employeeDTO.surname} type="text" placeholder="Фамилия" />
                                            <Input {...register(`name_${user.idUser}`)} defaultValue={user.employeeDTO.name} type="text" placeholder="Имя" />
                                            <Input {...register(`patronymic_${user.idUser}`)} defaultValue={user.employeeDTO.patronymic} type="text" placeholder="Отчество" />
                                            <Input {...register(`username_${user.idUser}`)} defaultValue={user.username} type="text" placeholder="Логин" />
                                            <Button type="submit">Сохранить</Button>
                                            <Button type="button" onClick={cancelEditingUser}>Отмена</Button>
                                        </Form>
                                    ) : (
                                        <div>
                                            <div>ФИО: {user.employeeDTO.surname + " " + user.employeeDTO.name + " " + user.employeeDTO.patronymic}</div>
                                            <div>Имя пользователя: {user.username}</div>
                                        </div>
                                    )}
                                </UserField>
                                <UserAction>
                                    {/* Добавляем кнопку "Активировать", если пользователь заблокирован */}
                                    {!user.active && (
                                        <Button onClick={() => activateUser(user.idUser)}>Активировать</Button>
                                    )}
                                    {/* Добавляем кнопку "Заблокировать", если пользователь активен */}
                                    {user.active && (
                                        <Button onClick={() => blockUser(user.idUser)}>Заблокировать</Button>
                                    )}
                                    {/* Добавляем кнопку "Редактировать" только если редактирование не активно */}
                                    {editingUserId !== user.idUser && (
                                        <button onClick={() => startEditingUser(user.idUser)}>Редактировать</button>
                                    )}
                                </UserAction>
                            </UserCard>

                        ))}
                        {/* Добавление нового пользователя */}
                        <Form onSubmit={handleSubmit(addUser)}>
                            <h3>Добавить сотрудника</h3>
                            <Input {...register("surname")} type="text" placeholder="Фамилия" />
                            <Input {...register("name")} type="text" placeholder="Имя" />
                            <Input {...register("patronymic")} type="text" placeholder="Отчество" />
                            <Input {...register("username")} type="text" placeholder="Логин" />
                            <Input {...register("password")} type="password" placeholder="Пароль" />
                            <Button type="submit">Добавить</Button>
                        </Form>
                    </UsersContainer>
                </BottomContainer>
            </RightContainer>
            <Modal active={modalActive} setActive={setModalActive}>
                <ModalContainer>
                    <Form onSubmit={handleSubmit(onChangePriority)}>
                        <Title>Смена приоритета задач</Title>
                        <Select {...register("idDocument")}>
                            <option value="">Выберите документ</option>
                            {documents?.map((document, index) => (
                                <option key={index} value={document.idDocument}>{document.fileName}</option>
                            ))}
                        </Select>
                        <Input {...register("idTaskUpdate")} defaultValue={idString}/>
                        <Button type="submit">Сменить</Button>
                    </Form>
                </ModalContainer>
            </Modal>
        </Container>
    )
}

export default UserProfile
