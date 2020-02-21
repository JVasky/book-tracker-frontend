import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Pagination from 'react-bootstrap/Pagination'
import ClipLoader from 'react-spinners/ClipLoader';
import BookService from '../../services/book.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

interface State {
    pendingBooks: any,
    loading: boolean,
    selectedBook?:number,
    approvalError:boolean,
    page:number,
    sort: {
        column:string,
        direction:string
    }
}

const bookService = new BookService();
const pageSize = 5;

export class AdminBooksPage extends React.Component<any, State> {

    constructor(props:any) {
        super(props);
        this.state = {
            pendingBooks: [],
            loading: true,
            selectedBook: undefined,
            approvalError: false,
            page:0,
            sort: {
                column: '',
                direction: 'desc'
            }
        };
        this.renderTable = this.renderTable.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.openApprovalModal = this.openApprovalModal.bind(this);
        this.handleApprovalClose = this.handleApprovalClose.bind(this);
        this.handleBookApproval = this.handleBookApproval.bind(this);
        this.onSort = this.onSort.bind(this);
        this.renderSortIcon = this.renderSortIcon.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.toPage = this.toPage.bind(this);
    }

    renderTable() {
        return this.state.pendingBooks.slice(pageSize * (this.state.page-1), pageSize * (this.state.page-1) + pageSize).map((book:any, index:number) => {
            const {id, title, description, created_dt} = book;
            return (
                <tr className='clickable' onClick={() => {this.openApprovalModal(id)}} key={id}>
                    <td>{id}</td>
                    <td>{title}</td>
                    <td>{description}</td>
                    <td>{this.formatDate(created_dt)}</td>
                </tr>
            );
        });
    }

    formatDate(date:string) {
        let dateOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        let timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        let dateObj = new Date(date);
        return (
            <>
            {dateObj.toLocaleDateString('en-US', dateOptions)} <br/>
            {dateObj.toLocaleTimeString('en-US', timeOptions)}
        </>)
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
                page: 1,
                loading: false
            });
        });
    }

    onSort(column:string) {
        const direction = this.state.sort.column !== '' ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sorted = this.state.pendingBooks;
        sorted.sort((a:any,b:any) => {
            if(column === 'id') {
                if(a[column] > b[column]) {
                    return -1;
                } else if(a[column] > b[column]) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return a[column].localeCompare(b[column]);
            }
        });
        if (direction === 'desc') {
            sorted.reverse();
        }
        this.setState({
            pendingBooks: sorted,
            page: 1,
            sort: {
                column: column,
                direction: direction
            }
        });
    }

    renderSortIcon(col:string) {
        if(this.state.sort.direction === 'asc' && this.state.sort.column === col) {
            return <FontAwesomeIcon icon={faSortUp} />;
        } else if (this.state.sort.direction === 'desc' && this.state.sort.column === col) {
            return <FontAwesomeIcon icon={faSortDown} />;
        } else {
            return <FontAwesomeIcon icon={faSort} />;
        }
    }

    nextPage() {
        if(this.state.page < Math.ceil(this.state.pendingBooks.length/pageSize)) {
            this.setState({
                page: this.state.page + 1
            })
        }
    }

    prevPage() {
        if(this.state.page > 1) {
            this.setState({
                page: this.state.page - 1
            })
        }
    }

    toPage(page:number) {
        if(page <= Math.ceil(this.state.pendingBooks.length/pageSize) && page > 0) {
            this.setState({
                page: page
            })
        }
    }

    renderPagination() {
        let leftNeighbor = null;
        let rightNeighbor = null;
        if (this.state.page - 1 > 1) {
            let p = this.state.page-1;
            leftNeighbor = (<>
                <Pagination.Item onClick={() => {this.toPage(1)}}>1</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => {this.toPage(p)}}>{p}</Pagination.Item>
            </>);
        }  else {
            leftNeighbor = (<>
            </>)
        }
        if (Math.ceil(this.state.pendingBooks.length/pageSize) - this.state.page > 1) {
            let p = this.state.page + 1;
            rightNeighbor = (<>
                <Pagination.Item onClick={() => {this.toPage(p)}}>{p}</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => {this.toPage(Math.ceil(this.state.pendingBooks.length/pageSize))}}>{Math.ceil(this.state.pendingBooks.length/pageSize)}</Pagination.Item>
            </>)
        } else {
            rightNeighbor = (<>
            </>)
        }
        return (
            <Pagination>
                <Pagination.First onClick={() =>{this.toPage(1)}}/>
                <Pagination.Prev onClick={this.prevPage}/>
                {leftNeighbor}
                <Pagination.Item active>{this.state.page}</Pagination.Item>
                {rightNeighbor}
                <Pagination.Next onClick={this.nextPage}/>
                <Pagination.Last onClick={() =>{this.toPage(Math.ceil(this.state.pendingBooks.length/pageSize))}}/>
            </Pagination>
        )
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
                        <h4 className="font-weight-bold col-12">Confirm Approval
                        <button className="close" onClick={this.handleApprovalClose}>x</button>
                        </h4>
                    </Modal.Header>
                    <Modal.Body>
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
                        <h1 className="p-3">Books Pending Approval</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr  className="table-primary">
                                        <th className="clickable" style={{ minWidth:75 }} onClick={() => {this.onSort('id')}}>Id {this.renderSortIcon('id')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('title')}}>Title {this.renderSortIcon('title')}</th>
                                        <th>Description</th>
                                        <th className="clickable" style={{ minWidth:150 }} onClick={() => {this.onSort('created_dt')}}>Date Created {this.renderSortIcon('created_dt')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTable()}
                                </tbody>
                            </Table>
                            {this.renderPagination()}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}