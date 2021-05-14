import { Form, Button, Spinner } from 'react-bootstrap'
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { api } from '../../axios.config';
import Usuario from '../../interfaces/Usuario'
import moment from "moment"

interface Props {
  isLoading: boolean;
  setEditing: (active: boolean) => void;
  isEditing: boolean;
  setLoading: (active: boolean) => void;
  setUserList: (usuarios: Usuario[]) => void;
  userList: Usuario[];
  selectedUser: Usuario;
  setSelectedUser: (usuarios: Usuario) => void;
}

const UserForm = (props: Props) => {

const SignupSchema = yup.object().shape({
  usuario: yup.string()
    .min(2, 'Nome de Usuário muito curto!')
    .max(50, 'Nome de Usuário muito longo!')
    .required('Campo obrigatório'),
    senha: yup.string()
    .min(6, 'Senha muito curta!')
    .required('Campo obrigatório'),
    cpf: yup.string()
    .min(11)
    .max(11)
    .required('Campo obrigatório'),
    dataDeNascimento: yup.date()
    .required('Campo obrigatório')
});

const handleEdit = async (values: object) => {
  try {
    props.setLoading(true)
    props.setEditing(false);
    const userIndex = props.userList.findIndex(user => user.id === props.selectedUser.id)
    const response = await api.put('/usuario', {...values, id: props.selectedUser.id})
    let userArray = props.userList
    userArray[userIndex] = response.data;
    props.setUserList(userArray)
  } catch (error) {
    console.log(error);
  } finally {
    props.setLoading(false)
  }
}

    return (
      <Formik initialValues=
      {{usuario: props.isEditing ? props.selectedUser.usuario: '',
      senha:props.isEditing ? props.selectedUser.senha: '',
      dataDeNascimento:props.isEditing ? moment(new Date(props.selectedUser.dataDeNascimento)).utc().format('YYYY-MM-DD') : '',
      estadoCivil:props.isEditing ? props.selectedUser.estadoCivil: 'Solteiro',
      cpf: props.isEditing ? props.selectedUser.cpf: ''}}
      enableReinitialize
      onSubmit={ async (values, {resetForm, setErrors}) => {
        try {
          props.setLoading(true)
          props.setEditing(false);
          const response = await api.post('/usuario', values)
          console.log(response);
          props.setUserList([...props.userList, response.data])
          resetForm()
        } catch (error) {
          const fieldError = error.response.data.message.split(" ")
          const message = error.response.data.message
          if (fieldError[0].toLowerCase() === 'usuario') {
            setErrors({usuario: message});
          }
          if (fieldError[0].toLowerCase() === 'cpf') {
            setErrors({cpf: message});
          }
          
        } finally {
          props.setLoading(false)
        }
        
     }}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={SignupSchema}>
        {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         setFieldValue,
       }) => (
        <Form className="user-form" onSubmit={handleSubmit}>
          { props.isLoading ? 
          <Spinner animation="border" variant="warning"/> : 
          <>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Usuário</Form.Label>
              <Form.Control 
              name="usuario" 
              type="text" 
              placeholder="Insira seu usuário"
              onChange={e => setFieldValue('usuario', e.currentTarget.value)}
              onBlur={handleBlur}
              value={values.usuario}
              isInvalid={!!errors.usuario}/>
              <Form.Control.Feedback type="invalid" > {errors.usuario}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
              name="senha" 
              onChange={handleChange} 
              type="password" 
              placeholder="Insira sua senha" 
              value={values.senha}
              isInvalid={!!errors.senha}/>
              <Form.Control.Feedback type="invalid" >{errors.senha}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicCpf">
              <Form.Label>CPF</Form.Label>
              <Form.Control 
              name="cpf" 
              onChange={handleChange} 
              type="text" 
              placeholder="Insira seu CPF" 
              value={values.cpf}
              isInvalid={!!errors.cpf}/>
              <Form.Control.Feedback type="invalid">{errors.cpf}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicBirthdayDate">
              <Form.Label>Data de nascimento</Form.Label>
              <Form.Control 
              name="dataDeNascimento" 
              onChange={handleChange}
              type="date" 
              value={values.dataDeNascimento}
              isInvalid={!!errors.dataDeNascimento}/>
              <Form.Control.Feedback type="invalid">{errors.dataDeNascimento}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="form.Control">
              <Form.Label>Estado civil</Form.Label>
                <Form.Control 
                as="select" 
                onChange={handleChange} 
                name="estadoCivil" 
                value={values.estadoCivil}
                >
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casado">Casado</option>
                  <option value="Viúvo">Viúvo</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Separado">Separado</option>
                </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={() => props.isEditing ? handleEdit(values) : handleSubmit}>
              {props.isEditing ? 'Atualizar' : 'Enviar'}
            </Button>
            </>}
          </Form>
           )}
      </Formik>
    )
}

export default UserForm