import React from "react";
import styled from "styled-components";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {useLocalStorage} from "react-use";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  background-color: rgb(255, 255, 255);
  gap: 2.5vw;
  padding: 1.5vw;
`

const Wrapper = styled.div`
  width: 40%;
  padding: 1vw;
  background-color: rgb(240, 240, 240);
  border-radius: .5vw;
`

const Title = styled.h1`
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1vw;
  text-align: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vw;
`

const Input = styled.input`
  border: .15vw solid black;
  border-radius: .5vw;
  padding: .5vw;

  &:focus {
    outline: none;
  }
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

const Registration = styled(Link)`
  color: rgb(0, 0, 0);
  text-decoration: none;
`

const Login: React.FC = () => {

    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    const [, setUser] = useLocalStorage('user', '')

    const handleLogin: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData()
        const username = data.username
        const password = data.password

        formData.append("username", username)
        formData.append("password", password)

        try {
            await axios.post('http://localhost:8080/api/users/authorization', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                setUser(JSON.stringify({id: res.data?.id_employee, token: res.data?.token, username: res.data?.username}))
                navigate('/home')
                navigate(0)
            })
        } catch (error: any) {
            if (error.response && error.response.status === 500) {
                alert("Ошибка входа. Вы заблокированы 😆🫵")
            } else if (error.response && error.response.status === 403) {
                alert("Неверные учётные данные")
            } else {
                alert(error)
            }
        }
    }

    return (
        <Container>
            <Wrapper>
                <Title>Войти в учётную запись</Title>
                <Form onSubmit={handleSubmit(handleLogin)}>
                    <Input type="text" {...register("username")} required placeholder="Имя пользователя"/>
                    <Input type="password" {...register("password")} required placeholder="Пароль"/>
                    <Button>Войти</Button>
                    <Registration to="/signup">Зарегистрироваться</Registration>
                </Form>
            </Wrapper>
        </Container>
    )
}

export default Login