
import 'bootstrap/dist/css/bootstrap.min.css';
import UserForm from './components/UserForm'
import TableUsers from './components/TableUsers'
import { useState } from 'react'
import Usuario from '../src/interfaces/Usuario'
import './App.css';

function App() {
  const [isLoading, setLoading] =useState(false);
  const [isEditing, setEditing] =useState(false);
  const [userList, setUserList] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState({id: 0, usuario: "", senha: "", cpf: "", dataDeNascimento: new Date(), estadoCivil: "Solteiro"});

  return (
    <div>
      <header>
        <h1 className="text-header">Usuários</h1>
      </header>
      <div className="App">
        <div className="text-register">
            <h1> {isEditing ? 'Editar' : 'Cadastro'}</h1>
        </div>
        <UserForm
          setEditing={setEditing}
          isEditing={isEditing}
          isLoading={isLoading}
          setLoading={setLoading}
          setUserList={setUserList}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          userList={userList}
        />
        <TableUsers 
          isLoading={isLoading}
          onLoading={setLoading}
          setEditing={setEditing}
          userList={userList}
          setUserList={setUserList}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
}

export default App;
