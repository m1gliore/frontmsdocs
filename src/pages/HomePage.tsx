import React from 'react';
import styled from 'styled-components';
import homePagePicture from "../assets/images/HomePagePicture.jpg"
import {
    BalanceOutlined,
    BorderColorOutlined,
    LockOutlined,
    SentimentSatisfiedAltOutlined
} from "@mui/icons-material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
`
const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  margin: 0 auto;
  padding: .8vw;
`

const MainHeader = styled.h1``

const Text = styled.p`
  font-size: 1.25rem;
  text-align: center;
`

const Image = styled.img``

const InfoContainer = styled.div`
  width: 100%;
  height: 25vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5vw 0;
  gap: 2.5vw;
`

const InfoItem = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1vw;
`

const InfoHeader = styled.h2`
  margin: 0;
`

const InfoDescription = styled.p`
  font-size: 1.25rem;
  margin: 0;
`

const HomePage: React.FC = () => {
    return (
        <Container>
            <Main>
                <MainHeader>Сделайте соглашения более приятными.</MainHeader>
                <Text>Оптимизируйте и автоматизируйте рабочие процессы по заключению контрактов в вашем бизнесе с помощью нашего сайта.</Text>
                <Image src={homePagePicture} alt="Изображения на главной"/>
                <InfoContainer>
                    <InfoItem>
                        <BorderColorOutlined fontSize="large"/>
                        <InfoHeader>Быстрее, чем на бумаге</InfoHeader>
                        <InfoDescription>Отправляйте и подписывайте соглашения до 80% быстрее.</InfoDescription>
                    </InfoItem>
                    <InfoItem>
                        <SentimentSatisfiedAltOutlined fontSize="large"/>
                        <InfoHeader>Просто и интуитивно понятно</InfoHeader>
                        <InfoDescription>Простое подписание для всех, независимо от того, разбираетесь вы в технологиях или нет.</InfoDescription>
                    </InfoItem>
                    <InfoItem>
                        <BalanceOutlined fontSize="large"/>
                        <InfoHeader>Юридическое обязательство</InfoHeader>
                        <InfoDescription>Журналы аудита обеспечивают подтверждение доступа к документам, проверки и подписи.</InfoDescription>
                    </InfoItem>
                    <InfoItem>
                        <LockOutlined fontSize="large"/>
                        <InfoHeader>Безопасно и надёжно</InfoHeader>
                        <InfoDescription>Безопасно подписывайте и запрашивайте подписи для самых важных документов.</InfoDescription>
                    </InfoItem>
                </InfoContainer>
            </Main>
        </Container>
    )
}

export default HomePage
