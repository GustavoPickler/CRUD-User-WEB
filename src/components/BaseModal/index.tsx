import {Button, Modal} from 'react-bootstrap'
interface Props {
    title : string;
    bodyText: string;
    handleClose: () => void;
    handleConfirm: () => void;
    show: boolean;
}

const BaseModal = (props: Props) => {
    return (
        <>
        <Modal centered={true} show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.bodyText}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Fechar
            </Button>
            <Button variant="primary" onClick={props.handleConfirm}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </> 
    )
}

export default BaseModal;