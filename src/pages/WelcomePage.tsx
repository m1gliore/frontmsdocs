import React from 'react';
import styled from 'styled-components';
import {Link} from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 76.3vh;
  padding: 0 5vw;
  background-color: rgb(255, 255, 255);
`

const Title = styled.h1`
  font-size: 2.25rem;
  color: rgb(51, 51, 51);
  margin-bottom: 1vw;
`

const Description = styled.p`
  font-size: 1.25rem;
  color: rgb(102, 102, 102);
  text-align: center;
`

const Button = styled.button`
  font-size: 1.25rem;
  background-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  border: none;
  padding: .5vw 1vw;
  border-radius: .2vw;
  cursor: pointer;
  margin-top: 1vw;
  transition: .25s ease-out;
  
  &:hover {
    transform: scale(1.1);
    opacity: .8;
  }
`

const WelcomePage: React.FC = () => {
    return (
        <Container>
            <Title>Сайт для Электронного Документооборота</Title>
            <Description>
                Наш сайт предоставляет надежное и удобное решение для ведения электронного
                документооборота и архивирования документов с использованием электронно-цифровой подписи.
            </Description>
            <Link to="/home"><Button>Узнать больше</Button></Link>
        </Container>
    )
}

export default WelcomePage
