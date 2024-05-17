import React, {useEffect, useState} from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"
import Modal from "../components/Modal";
import axios from "axios";
import {useLocalStorage} from "react-use";
import {
    AddOutlined,
    ArchiveOutlined,
    ArticleOutlined,
    DeleteOutlined,
    EditOutlined,
    SettingsOutlined
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {DecodedToken, Document} from "../types";
import jwtDecode from "jwt-decode";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
`

const Delete = styled(DeleteOutlined)`
  cursor: pointer;
  margin-right: .5vw;
`

const Edit = styled(EditOutlined)`
  cursor: pointer;
  margin-right: .5vw;
`

const Add = styled(AddOutlined)`
  cursor: pointer;
  margin-right: .5vw;
`

const Docs = styled(ArticleOutlined)`
  cursor: pointer;
  margin-right: .5vw;
`

const ArchDocs = styled(ArchiveOutlined)`
  cursor: pointer;
  margin-right: .5vw;
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

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 73vh;
  width: 90vw;
  margin: 0 auto;
  padding: .8vw;
`

const TextEditorContainer = styled.div`
  height: 100%;
  width: 100%;
`

const Title = styled.h1``

const Button = styled.button`
  font-size: 1rem;
  margin-top: 5vw;
  border: none;
  background-color: rgb(96, 96, 218);
  color: rgb(255, 255, 255);
  width: 7.5vw;
  height: 5vh;
  border-radius: .5vw;
  cursor: pointer;
  transition: .5s ease-out;

  &:hover {
    transform: scale(1.1);
  }
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
  gap: 10px;
`

const Input = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;
  display: block;
  width: 0;
  height: 0;
`

const InputFile = styled.label`
  position: relative;
  display: inline-block;
`

const InputFileText = styled.span`
  padding: 0 10px;
  line-height: 40px;
  text-align: left;
  height: 40px;
  display: block;
  float: left;
  box-sizing: border-box;
  width: 200px;
  border-radius: 6px 0 0 6px;
  border: 1px solid #ddd;
`

const InputFileButton = styled.span`
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  font-size: 14px;
  vertical-align: middle;
  color: rgb(255 255 255);
  text-align: center;
  border-radius: 0 4px 4px 0;
  background-color: rgb(96, 96, 218);
  line-height: 22px;
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
  border: none;
  margin: 0;
  transition: background-color 0.2s;
`

const Redactor = styled(ReactQuill)`
  height: 45vh;
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
  margin-bottom: 2vw;
`

const InputNew = styled.input`
  width: 21vw;
  height: 5vh;
  margin-bottom: 2vw;
  border: 1px solid #ddd;
  padding: .5vw;
  border-radius: 6px;
`

const DocumentPage: React.FC = () => {

    const [modalActive, setModalActive] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [documentData, setDocumentData] = useLocalStorage('documentData', "")
    const defaultValue = documentData ? JSON.parse(documentData as string)?.file_in_byte : ""
    const [editorValue, setEditorValue] = useState<string>(defaultValue)
    const [currentWindow, setCurrentWindow] = useState<string>("")
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()
    const [documents, setDocuments] = useState<Array<Document>>([])
    const [selectedFileName, setSelectedFileName] = useState<string>('')
    const [settingsVisibility, setSettingsVisibility] = useState<boolean>(false)
    const [admin, setAdmin] = useState<boolean>(true)
    const [user,] = useLocalStorage<string>("user")
    const [archievedDocs, setArchievedDocs] = useState<Array<Document>>([])
    const [currentDocumentState, setCurrentDocumentState] = useState<string>("docs")
    const [uniqueNumber, setUniqueNumber] = useState<string>('');
    const [eDocumentType, setEDocumentType] = useState<string>('');

    useEffect(() => {
        if (user) {
            const decodedToken = jwtDecode(JSON.parse(user).token) as DecodedToken
            setAdmin(decodedToken.isAdmin)
        }
    }, [user])

    useEffect(() => {
        (async () => {
            admin && await axios.get('http://localhost:8080/api/documents/getAll_documents')
                .then((res) => setDocuments(res.data))
            admin && await axios.get('http://localhost:8080/api/documents/getAll_documents_archive')
                .then((res) => {
                    setArchievedDocs(res.data)
                })
        })()
    }, [admin])

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = event.target.files && event.target.files[0]
        if (file) {
            setSelectedFileName(file.name)
            setSelectedFile(file)
        }
    }

    const handleSubmitToServer = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (selectedFile) {
            const formData = new FormData()
            formData.append('fileName', selectedFile.name)
            formData.append('file', selectedFile)
            formData.append('id_employee_publisher', JSON.parse(user as string)?.id)
            formData.append('eDocumentType', eDocumentType)
            formData.append('uniqueNumber', uniqueNumber)

            try {
                const response = await axios.create({
                    headers: {
                        Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                    }
                })
                    .post('http://localhost:8080/api/documents/create_document',
                        formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(() => navigate(0))
            } catch (error) {
                alert(error)
            }
        }
    }

    const handleEditorChange = (value: string) => {
        setEditorValue(value)
    }

    const handleSendToServer = async () => {
        const formData = new FormData()
        formData.append("fileName", JSON.parse(documentData as string).fileName)
        formData.append("fileDirectory", JSON.parse(documentData as string).fileDirectory)
        formData.append("comment", "mamas")
        formData.append('eDocumentType', eDocumentType)
        formData.append('uniqueNumber', uniqueNumber)

        const file = new Blob([editorValue], {type: "text/html"})

        formData.append("file", file, JSON.parse(documentData as string).fileName)
        await axios.post(`http://localhost:8080/api/nodes/finish_node/${JSON.parse(documentData as string).id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Content-Disposition': `attachment; filename="${JSON.parse(documentData as string).fileName}"`
            }
        }).then(() => {
            setDocumentData("")
            navigate(0)
        })
    }

    const updateDocument: SubmitHandler<FieldValues> = async (data) => {
        if (selectedFile) {
            const formData = new FormData()
            formData.append('idDocument', data.document)
            formData.append('fileName', selectedFile.name)
            formData.append('file', selectedFile)
            formData.append('id_employee_publisher', "4")
            formData.append('eDocumentType', eDocumentType)
            formData.append('uniqueNumber', uniqueNumber)

            try {
                await axios.put('http://localhost:8080/api/documents/update_document',
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                        }
                    }).then(() => navigate(0))
            } catch (error) {
                alert(error)
            }
        }
    }

    const deleteDocument: SubmitHandler<FieldValues> = async (data) => {
        try {
            await axios.delete(`http://localhost:8080/api/documents/deleteDocumentBy/${data.documentDelete}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${JSON.parse(user as string)?.token}`
                }
            }).then(() => navigate(0))
        } catch (error) {
            alert(error)
        }
    }

    const downloadFile = (base64Data: string, fileName: string) => {
        const decodedData = atob(base64Data)
        const byteNumbers = new Array(decodedData.length)
        for (let i = 0; i < decodedData.length; i++) {
            byteNumbers[i] = decodedData.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], {type: 'application/octet-stream'})
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName
        link.click()
    }

    const handleAddClick = () => {
        setModalActive(true);
        setSelectedFileName('');
        setCurrentWindow("create");
        setUniqueNumber('');
        setEDocumentType('');
    };

    const handleUpdateClick = () => {
        setModalActive(true);
        setSelectedFileName('');
        setCurrentWindow("update");
        setUniqueNumber('');
        setEDocumentType('');
    };

    return (
        <Container>
            {admin &&
                <SettingsContainer onMouseOver={() => setSettingsVisibility(true)}
                                   onMouseOut={() => setSettingsVisibility(false)}>
                    <Settings style={{display: settingsVisibility ? "none" : "block"}} fontSize="large"/>
                    <Tooltip title="Добавить документ" placement="bottom">
                        <Add style={{display: settingsVisibility ? "block" : "none"}} fontSize="large"
                             onClick={handleAddClick}/>
                    </Tooltip>
                    <Tooltip title="Изменить документ" placement="bottom">
                        <Edit style={{display: settingsVisibility ? "block" : "none"}} fontSize="large"
                              onClick={handleUpdateClick}/>
                    </Tooltip>
                    <Tooltip title="Удалить документ" placement="bottom">
                        <Delete style={{display: settingsVisibility ? "block" : "none"}} fontSize="large"
                                onClick={() => {
                                    setModalActive(true)
                                    setSelectedFileName('')
                                    setCurrentWindow("delete")
                                }}/>
                    </Tooltip>
                    <Tooltip title="Документы" placement="bottom">
                        <Docs
                            style={{display: settingsVisibility && currentDocumentState !== "docs" ? "block" : "none"}}
                            fontSize="large" onClick={() => {
                            setCurrentDocumentState("docs")
                        }}/>
                    </Tooltip>
                    <Tooltip title="Архив" placement="bottom">
                        <ArchDocs
                            style={{display: settingsVisibility && currentDocumentState !== "archive" ? "block" : "none"}}
                            fontSize="large" onClick={() => {
                            setCurrentDocumentState("archive")
                        }}/>
                    </Tooltip>
                </SettingsContainer>
            }
            <Main>
                {admin &&
                    <>
                        <Title style={{display: currentDocumentState === "archive" ? "block" : "none"}}>Архив</Title>
                        <Title style={{display: currentDocumentState === "docs" ? "block" : "none"}}>Документы</Title>
                    </>
                }
                {!admin &&
                    <>
                        <Title>Текущий документ</Title>
                        <TextEditorContainer>
                            <Redactor theme="snow" value={editorValue} onChange={handleEditorChange}/>
                        </TextEditorContainer>
                        <Button onClick={handleSendToServer}>Отправить</Button>
                    </>
                }
                {admin &&
                    <>
                        <TableContainer
                            style={{marginTop: "5vw", display: currentDocumentState === "docs" ? "block" : "none"}}
                            component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Номер</TableCell>
                                        <TableCell>Документ</TableCell>
                                        <TableCell>Выполнил</TableCell>
                                        <TableCell>Тип</TableCell>
                                        <TableCell>Регистрационный номер</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documents.map((document, index) => (
                                        <TableRow key={index}
                                                  style={{cursor: "pointer"}}
                                                  onClick={() => downloadFile(document.file_in_byte, document.fileName)}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {document.fileName}
                                            </TableCell>
                                            <TableCell>{document.employeeDTO.surname + " " + document.employeeDTO.name + " " + document.employeeDTO.patronymic}</TableCell>
                                            <TableCell>{document.edocumentType}</TableCell>
                                            <TableCell>{document.uniqueNumber}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer
                            style={{marginTop: "5vw", display: currentDocumentState === "archive" ? "block" : "none"}}
                            component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Номер</TableCell>
                                        <TableCell>Документ</TableCell>
                                        <TableCell>Тип</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {archievedDocs.map((document, index) => (
                                        <TableRow key={index}
                                                  style={{cursor: "pointer"}}
                                                  onClick={() => downloadFile(document.file_in_byte, document.fileName)}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {document.fileName}
                                            </TableCell>
                                            <TableCell>{document.edocumentType}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                }
            </Main>
            <Modal active={modalActive} setActive={setModalActive}>
                <ModalContainer style={{display: currentWindow !== "create" ? "none" : "flex"}}>
                    <Title>Добавить документ</Title>
                    <Form onSubmit={handleSubmitToServer}>
                        <InputFile>
                            <InputFileText>{selectedFileName}</InputFileText>
                            <Input type="file" accept=".docx" onChange={onFileChange}/>
                            <InputFileButton>Выберите файл</InputFileButton>
                        </InputFile>
                            <InputNew
                                style={{marginTop: "2.5vw"}}
                                placeholder="Уникальный номер"
                                value={uniqueNumber}
                                onChange={(e) => setUniqueNumber(e.target.value)}
                                required
                            />
                        <InputNew
                            placeholder="Тип документа"
                            value={eDocumentType}
                            onChange={(e) => setEDocumentType(e.target.value)}
                            required
                        />
                        <Button type="submit">Добавить</Button>
                    </Form>
                </ModalContainer>
                <ModalContainer style={{display: currentWindow !== "update" ? "none" : "flex"}}>
                    <Title>Изменить документ</Title>
                    <Form onSubmit={handleSubmit(updateDocument)}>
                        <Select {...register("document")}>
                            <option value="">Выберите документ</option>
                            {documents?.map((document, index) => (
                                <option key={index} value={document.idDocument}>{document.fileName}</option>
                            ))}
                        </Select>
                        <InputFile>
                            <InputFileText>{selectedFileName}</InputFileText>
                            <Input type="file" accept=".docx" onChange={onFileChange}/>
                            <InputFileButton>Выберите файл</InputFileButton>
                        </InputFile>
                        <InputNew
                            style={{marginTop: "2.5vw"}}
                            placeholder="Уникальный номер"
                            value={uniqueNumber}
                            onChange={(e) => setUniqueNumber(e.target.value)}
                            required
                        />
                        <InputNew
                            placeholder="Тип документа"
                            value={eDocumentType}
                            onChange={(e) => setEDocumentType(e.target.value)}
                            required
                        />
                        <Button type="submit">Изменить</Button>
                    </Form>
                </ModalContainer>
                <ModalContainer style={{display: currentWindow !== "delete" ? "none" : "flex"}}>
                    <Title>Удалить документ</Title>
                    <Form onSubmit={handleSubmit(deleteDocument)}>
                        <Select {...register("documentDelete")}>
                            <option value="">Выберите документ</option>
                            {documents?.map((document, index) => (
                                <option key={index} value={document.idDocument}>{document.fileName}</option>
                            ))}
                        </Select>
                        <Button type="submit">Удалить</Button>
                    </Form>
                </ModalContainer>
            </Modal>
        </Container>
    )
}

export default DocumentPage
