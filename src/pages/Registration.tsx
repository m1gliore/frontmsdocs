import React from "react";
import styled from "styled-components";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

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

const Login = styled(Link)`
  color: rgb(0, 0, 0);
  text-decoration: none;
`

const Registration: React.FC = () => {

    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()

    const handleRegistration: SubmitHandler<FieldValues> = async (data) => {
        const formData = new FormData()
        const username = data.username
        const password = data.password
        const repeatPassword = data.repeatPassword
        const name = data.name
        const surname = data.surname
        const patronymic = data.patronymic

        if (password === repeatPassword) {

            formData.append("username", username)
            formData.append("password", password)
            formData.append("employeeDTO.name", name)
            formData.append("employeeDTO.surname", surname)
            formData.append("employeeDTO.patronymic", patronymic)

            try {
                await axios.post('http://localhost:8080/api/users/registrationNewUser', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    navigate('/signin')
                })
            } catch (error) {
                alert(error)
            }
        } else {
            alert("Пароли не совпадают!")
        }
    }

    return (
        <Container>
            <Wrapper>
                <Title>Создать учётную запись</Title>
                <Form onSubmit={handleSubmit(handleRegistration)}>
                    <Input type="text" {...register("username")} required placeholder="Имя пользователя"/>
                    <Input type="text" {...register("surname")} required placeholder="Фамилия"/>
                    <Input type="text" {...register("name")} required placeholder="Имя"/>
                    <Input type="text" {...register("patronymic")} required placeholder="Отчество"/>
                    <Input type="password" {...register("password")} required minLength={8} placeholder="Пароль"/>
                    <Input type="password" {...register("repeatPassword")} required minLength={8} placeholder="Повторите пароль"/>
                    <Button>Создать</Button>
                    <Login to="/signin">Войти</Login>
                </Form>
            </Wrapper>
        </Container>
    )
}

export default Registration