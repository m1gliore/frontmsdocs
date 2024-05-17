import {TooltipProps} from "recharts";

export type Document = {
    idDocument: number
    fileName: string
    file_in_byte: string
    employeeDTO: Employee
    edocumentType: string
    uniqueNumber: string
}

export type Employee = {
    idEmployee: number
    surname: string
    name: string
    patronymic: string
}

export type Task = {
    idTask: number
    nameTask: string
    employees: Array<EmployeeList>
    sequentialTaskNodeDTOS: Array<TaskNode>
}

export type TaskNode = {
    idSequentialTaskNode: number
    name_node: string
}

export type EmployeeList = {
    name: string
    surname: string
    patronymic: string
}

export interface DecodedToken {
    isAdmin: boolean
}

export interface CustomTooltipProps extends TooltipProps<any, any> {
    active?: boolean
    payload?: Array<{ name: string; value: number }>
}

export type Notification = {
    idNotification: number
    taskMessage: string
}

export interface TaskName {
    employeeId: string
    taskName: string
}

export type User = {
    idUser: number
    active: boolean
    employeeDTO: Employee
    password: string
    username: string
}