import React from 'react';
import styled from "styled-components";
import {DateTime} from "luxon";

const Wrapper = styled.footer`
  background-color: rgb(51, 51, 51);
  color: rgb(255, 255, 255);
  padding: .8vw;
  text-align: center;
`

const Content = styled.p`
  font-size: 1.25rem;
  text-align: center;
`

const Footer: React.FC = () => {
    return (
        <Wrapper>
            <Content>&copy; {DateTime.now().year} MSDocs. Все права защищены.</Content>
        </Wrapper>
    )
}

export default Footer
