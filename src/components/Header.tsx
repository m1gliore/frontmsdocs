import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import {NotificationsOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useLocalStorage} from "react-use";
import jwtDecode from "jwt-decode";
import {DecodedToken, Notification} from "../types";
import axios from "axios";
import {Badge, List, ListItem, ListItemText, Popover} from "@mui/material";

const Wrapper = styled.div`
  background-color: rgb(0, 123, 255);
  color: rgb(255, 255, 255);
  padding: .8vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  cursor: pointer;
  color: rgb(255, 255, 255);
  text-decoration: none;
  margin: 1rem 0;
  font-weight: bold;

  &:hover {
    opacity: .8;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1vw;
`

const Notifications = styled(NotificationsOutlined)`
  cursor: pointer;

  &:hover {
    opacity: .8;
  }
`

const NavItem = styled(Link)`
  color: rgb(255, 255, 255);
  text-decoration: none;

  &:hover {
    opacity: .8;
  }
`

const NotificationPopover = styled(Popover)`
  .MuiPopover-paper {
    padding: 1rem;
    max-width: 300px;
  }
`

const Header: React.FC = () => {

    const [admin, setAdmin] = useState<boolean>(false)
    const [user,] = useLocalStorage<string>("user")
    const [notifications, setNotifications] = useState<Array<Notification>>([])
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    useEffect(() => {
        if (user !== "") {
            const decodedToken = jwtDecode(JSON.parse(user as string).token) as DecodedToken
            setAdmin(decodedToken.isAdmin)
        }
    }, [user])

    const checkForUpdates = useCallback(async () => {
        await axios.get(`http://localhost:8080/api/notifications/get_notification_by_user/${JSON.parse(user as string).id}`)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Network response was not ok')
                }
                return res
            })
            .then(res => {
                setNotifications(res.data)
                setTimeout(checkForUpdates, 2000)
            })
            .catch(err => {
                alert(`There was a problem with the fetch operation: ${err}`)
                setTimeout(checkForUpdates, 2000)
            })
    }, [user])

    useEffect(() => {
        if (user !== "") {
            checkForUpdates()
        }
    }, [user, checkForUpdates])

    const handleNotificationsClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        // @ts-ignore
        setAnchorEl(event.currentTarget)
    }

    const handleNotificationsClose = async (id?: number) => {
        setAnchorEl(null)
        if (id) {
            await axios.delete(`http://localhost:8080/api/notifications/delete_notification/${id}`)
                .then(() => {
                    checkForUpdates()
                })
        }
    }

    return (
        <Wrapper>
            <Logo to="/">MSDocs</Logo>
            <Nav>
                {user !== "" &&
                    <Badge style={{marginRight: "1.5vw"}} badgeContent={notifications.length} color="secondary">
                        <Notifications onClick={handleNotificationsClick}/>
                    </Badge>}
                <NavItem to="/home">Главная</NavItem>
                {user !== "" && admin && <NavItem to="/documents">Документы</NavItem>}
                {user !== "" && <NavItem to="/tasks">Задачи</NavItem>}
                {user !== "" ? (
                    admin ? (
                        <NavItem to="/profile/admin">Профиль</NavItem>
                    ) : (
                        <NavItem to="/profile/user">Профиль</NavItem>
                    )
                ) : null}
                {user === "" && <NavItem to="/signin">Войти</NavItem>}
            </Nav>
            <NotificationPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => handleNotificationsClose()}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List>
                    {notifications.map((notification, index) => {
                        if (notification.taskMessage === "NEW_NODE_TASK") {
                            return (
                                <ListItem key={index}>
                                    <NavItem style={{color: "black"}} to="/tasks"
                                             onClick={() => handleNotificationsClose(notification.idNotification)}
                                             >
                                        <ListItemText primary="У вас новое задание"/>
                                    </NavItem>
                                </ListItem>
                            )
                        } else if (notification.taskMessage === "DO_NODE_TASK") {
                            return (
                                <ListItem key={index}>
                                    <NavItem style={{color: "black"}} to="/tasks"
                                             onClick={() => handleNotificationsClose(notification.idNotification)}
                                             >
                                        <ListItemText primary="У вас есть невыполненное задание"/>
                                    </NavItem>
                                </ListItem>
                            )
                        } else if (notification.taskMessage === "DO_TASK") {
                            return (
                                <ListItem key={index}>
                                    <NavItem style={{color: "black"}} to="/tasks"
                                             onClick={() => handleNotificationsClose(notification.idNotification)}
                                             >
                                        <ListItemText primary="У вас есть невыполненное задание"/>
                                    </NavItem>
                                </ListItem>
                            )
                        } else if (notification.taskMessage === "FINISH_TASK") {
                            return (
                                <ListItem key={index}>
                                    <NavItem style={{color: "black"}} to="/tasks"
                                             onClick={() => handleNotificationsClose(notification.idNotification)}
                                             >
                                        <ListItemText primary="Задание было завершено"/>
                                    </NavItem>
                                </ListItem>
                            )
                        }
                        return null
                    })}
                </List>
            </NotificationPopover>
        </Wrapper>
    )
}

export default Header
