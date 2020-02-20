import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ClipLoader from 'react-spinners/ClipLoader';
import BookService from '../../services/book.service';

interface State {
    pendingBooks: any,
    loading: boolean,
    selectedBook?:number,
    approvalError:boolean
}

const bookService = new BookService();

export class AdminBooksPage extends React.Component<any, State> {

    constructor(props:any) {
        super(props);
        this.state = {
            pendingBooks: [],
            loading: true,
            selectedBook: undefined,
            approvalError: false
        };
        this.renderTable = this.renderTable.bind(this);
        this.openApprovalModal = this.openApprovalModal.bind(this);
        this.handleApprovalClose = this.handleApprovalClose.bind(this);
        this.handleBookApproval = this.handleBookApproval.bind(this);
    }

    renderTable() {
        return this.state.pendingBooks.map((book:any, index:number) => {
            const {id, title, description, created_dt} = book;
            return (
                <tr className='clickable' onClick={() => {this.openApprovalModal(id)}} key={id}>
                    <td>{id}</td>
                    <td>{title}</td>
                    <td>{description}</td>
                    <td>{created_dt}</td>
                </tr>
            );
        });
    }

    openApprovalModal(id:number) {
        this.setState({
            selectedBook: id
        })
    }

    handleApprovalClose() {
        this.setState({
            selectedBook: undefined,
            approvalError:false
        });
    }

    handleBookApproval() {
        if(this.state.selectedBook !== undefined) {
            bookService.approve(this.state.selectedBook).then(() => {
                let newBookList = this.state.pendingBooks.filter((book:any) => {
                    return book.id !== this.state.selectedBook;
                });
                this.setState({
                    selectedBook: undefined,
                    pendingBooks: newBookList,
                    approvalError:false
                });
            }).catch((response) => {
                this.setState({
                    approvalError: true
                });
            });
        }
    }

    componentDidMount() {
        bookService.getPending().then((books) => {
            this.setState({
                pendingBooks: books,
                loading: false
            });
        });
    }

    render() {
        if(this.state.loading) {
            return (
                <ClipLoader css={'display:block;margin:0 auto;'} size={200} color={"#123abc"} loading={this.state.loading} />
            );
        }
        return (
            <div>
                <Modal show={this.state.selectedBook !== undefined}>
                    <Modal.Header>
                        <h4 className="text-center font-weight-bold col-12">Confirm Approval
                        <button className="close" onClick={this.handleApprovalClose}>x</button>
                        </h4>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        Are you sure you want to approve book id: {this.state.selectedBook} ?
                        <Alert className="text-center" variant={'danger'} show={this.state.approvalError}>Error approving book!</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-success" onClick={this.handleBookApproval}>Confirm</Button>
                        <Button className="btn-danger" onClick={this.handleApprovalClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
                <Row>
                    <Col>
                        <h1 className="text-center p-3">Books Pending Approval</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr  className="table-primary">
                                        <th>Book Id</th>
                                        <th>Book Title</th>
                                        <th>Description</th>
                                        <th>Date Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTable()}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}