import { Button, Table, InputGroup, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import BaseModal from '../BaseModal'
import { useState, useEffect  } from 'react'
import { api }  from '../../axios.config.js'
import { AxiosResponse } from 'axios';
import Usuario from '../../interfaces/Usuario'
import moment from "moment"
import { useDebounce } from 'use-lodash-debounce'

interface Props {
    onLoading: (active: boolean) => void;
    setEditing: (active: boolean) => void;
    isLoading: boolean;
    setUserList: (usuarios: Usuario[]) => void;
    userList: Usuario[];
    selectedUser: Usuario;
    setSelectedUser: (usuario: Usuario) => void;
  }

const TableUsers = (props: Props) => {
    const [isShowing, setShow] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounce(search, 700)

    useEffect(() => {
        const filteredUsuarios = async() => { 
            const filteredList = await api.get(`/usuario/${search}`)
            props.setUserList(filteredList.data)
        }
        filteredUsuarios()
      }, [debouncedValue]);
     

    useEffect(() => {
       api.get('/usuario').then((response: AxiosResponse) => {
        props.setUserList(response.data)
       })
    }, [])

    const handleEdit = (user: Usuario) => { 
        props.setEditing(true)
        props.setSelectedUser(user)
        
    }
    const handleDelete = (user: Usuario) => {
        props.setSelectedUser(user)
        setShow(true)
    }
    const handleConfirm = async () => { 
        try {
            await api.delete(`/usuario/${props.selectedUser.id}`)
            const userListUpdated = props.userList.filter(user => user.id !== props.selectedUser.id)
            props.setUserList(userListUpdated)
            setShow(false)
        } catch(error) {
            console.log(error);
        }
    }
    const handleClose = () => {
        setShow(false)
    }

    return(
        <>
            <BaseModal
                show = {isShowing}
                handleConfirm = {handleConfirm}
                handleClose = {handleClose}
                bodyText={`Você deseja realmente deletar ${props.selectedUser.usuario}?`}
                title='Deletar'
            />
            <div className="app-table">
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1" style={{backgroundColor: 'white'}}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Pesquisar"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={(event) => setSearch(event.target.value)}
                    />
                </InputGroup>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Senha</th>
                            <th>CPF</th>
                            <th>Data de Nascimento</th>
                            <th>Estado Civil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userList.map((user) => {
                            return(
                                <tr key={user.id}>
                                    
                                <td> {user.usuario} </td>
                                <OverlayTrigger
                                    key={user.id}
                                    placement={'bottom'}
                                    overlay={
                                        <Tooltip id={`tooltip-${user.id}`}>
                                            {user.senha}
                                        </Tooltip>
                                    }
                                    >
                                    <td> {user.senha} </td>
                                </OverlayTrigger>
                                <td> {user.cpf} </td>
                                <td> {moment(user.dataDeNascimento).utc().format('DD/MM/YYYY')} </td>
                                <td> {user.estadoCivil} </td>
                                <td>
                                <Button size='sm' style={{marginRight: 10}} onClick={() => handleEdit(user)}> Editar </Button>
                                <OverlayTrigger
                                    key={user.id}
                                    placement={'bottom'}
                                    overlay={
                                        <Tooltip id={`tooltip-${user.id}`}>
                                            Excluir
                                        </Tooltip>
                                    }
                                    >
                                <Button size='sm' style={{backgroundColor: 'red'}} onClick={() => handleDelete(user)}><FontAwesomeIcon icon={faTrashAlt}/> </Button>
                                </OverlayTrigger>
                                </td>
                                </tr>
                            )}) }
                    </tbody>  
                </Table>
            </div>
        </>
    )

}

export default TableUsers