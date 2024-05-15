import React from "react";
import styled from "styled-components";

const ModalWindow = styled.div<{ $active: string }>`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, .4);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$active === "true" ? 1 : 0};
  pointer-events: ${props => props.$active === "true" ? "all" : "none"};
  transition: .5s;
  z-index: 100;
`

const ModalWindowContent = styled.div<{ $active: string }>`
  width: fit-content;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  transform: ${props => props.$active === "true" ? "scale(1)" : "scale(.5)"};
  transition: .4s all;
  z-index: 100;
`

interface ModalProps {
    active: boolean
    setActive: (active: boolean) => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({active, setActive, children}) => {
    return (
        <ModalWindow $active={active ? "true" : "false"} onClick={() => setActive(false)}>
            <ModalWindowContent $active={active ? "true" : "false"} onClick={e => e.stopPropagation()}>
                {children}
            </ModalWindowContent>
        </ModalWindow>
    )
}

export default Modal
