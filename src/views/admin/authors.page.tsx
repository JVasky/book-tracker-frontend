import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Paginator from '../../components/paginator.component'
import ClipLoader from 'react-spinners/ClipLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import AuthorService from '../../services/author.service';

interface Author {
    id:number,
    first_name:string,
    middle_name:string,
    last_name:string,
    bio:string,
    approved:boolean
}

const getBlankAuthor = () => {
    return {
        id:0,
        first_name: '',
        middle_name: '',
        last_name: '',
        bio: '',
        approved: false
    };
};

interface State {
    pendingAuthors: any,
    loading: boolean,
    selectedAuthor?:number,
    modifyAuthor:boolean,
    selectedAuthorModify:Author,
    approvalError:boolean,
    modifyError:boolean,
    page:number,
    numberOfPages:number,
    sort: {
        column:string,
        direction:string
    },
    pageError:string
}

const authorService = new AuthorService();
const pageSize = 5;

export class AdminAuthorsPage extends React.Component<any, State> {

    constructor(props:any) {
        super(props);
        this.state = {
            pendingAuthors: [],
            loading: true,
            selectedAuthor: undefined,
            modifyAuthor: false,
            selectedAuthorModify: getBlankAuthor(),
            approvalError: false,
            modifyError: false,
            page:0,
            numberOfPages:0,
            sort: {
                column: '',
                direction: 'desc'
            },
            pageError: ''
        };
        this.renderTable = this.renderTable.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.openApprovalModal = this.openApprovalModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.handleApprovalClose = this.handleApprovalClose.bind(this);
        this.handleAuthorApproval = this.handleAuthorApproval.bind(this);
        this.handleModifyClose = this.handleModifyClose.bind(this);
        this.handleModChange = this.handleModChange.bind(this);
        this.handleAuthorModify = this.handleAuthorModify.bind(this);
        this.onSort = this.onSort.bind(this);
        this.renderSortIcon = this.renderSortIcon.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.toPage = this.toPage.bind(this);
    }

    componentDidMount() {
        authorService.getPending().then((authors) => {
            this.setState({
                pendingAuthors: authors,
                page: 1,
                numberOfPages: Math.ceil(authors.length/pageSize),
                loading: false
            });
        }).catch(error => {
            if(error.response.status !== 404) {
                this.setState({
                    pageError: "There was an error loading the page, please contact administrator.",
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                })
            }
        });
    }

    // table related methods
    renderTable() {
        return this.state.pendingAuthors.slice(pageSize * (this.state.page-1), pageSize * (this.state.page-1) + pageSize).map((author:any, index:number) => {
            const {id, first_name, middle_name, last_name, bio, created_dt} = author;
            return (
                <tr key={id}>
                    <td className='clickable' onClick={() => {this.openEditModal(author)}}>{id}</td>
                    <td className='clickable' onClick={() => {this.openEditModal(author)}}>{first_name}</td>
                    <td className='clickable' onClick={() => {this.openEditModal(author)}}>{middle_name}</td>
                    <td className='clickable' onClick={() => {this.openEditModal(author)}}>{last_name}</td>
                    <td className='clickable' onClick={() => {this.openEditModal(author)}}>{bio}</td>
                    <td className='clickable' onClick={() => {this.openEditModal(author)}}>{this.formatDate(created_dt)}</td>
                <td><Button onClick={() => {this.openApprovalModal(id)}} variant="outline-success">Approve</Button></td>
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

    onSort(column:string) {
        const direction = this.state.sort.column !== '' ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sorted = this.state.pendingAuthors;
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
                if(a[column] !== null &&  b[column] === null) {
                   return -1;
                } else if (a[column] === null && b[column] !== null) {
                    return 1;
                } else if (a[column] === null && b[column] === null) {
                    return 0;
                } else {
                    return a[column].localeCompare(b[column]);
                }
            }
        });
        if (direction === 'desc') {
            sorted.reverse();
        }
        this.setState({
            pendingAuthors: sorted,
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

    openApprovalModal(id:number) {
        this.setState({
            selectedAuthor: id
        })
    }

    openEditModal(author:any) {
        this.setState({
            modifyAuthor: true,
            selectedAuthorModify: author
        })
    }

    handleApprovalClose() {
        this.setState({
            selectedAuthor: undefined,
            approvalError:false
        });
    }

    handleAuthorApproval() {
        if(this.state.selectedAuthor !== undefined) {
            authorService.approve(this.state.selectedAuthor).then(() => {
                let newAuthorList = this.state.pendingAuthors.filter((author:any) => {
                    return author.id !== this.state.selectedAuthor;
                });
                this.setState({
                    selectedAuthor: undefined,
                    pendingAuthors: newAuthorList,
                    numberOfPages: Math.ceil(newAuthorList.length/pageSize),
                    approvalError:false
                });
            }).catch((response) => {
                this.setState({
                    approvalError: true
                });
            });
        }
    }

    handleModifyClose() {
        this.setState({
            selectedAuthorModify: getBlankAuthor(),
            modifyAuthor:false,
            modifyError: false
        })
    }

    handleAuthorModify() {
        let a = this.state.selectedAuthorModify;
        a.approved = true;
        authorService.update(a).then(() => {
            let newAuthorList = this.state.pendingAuthors.filter((author:any) => {
                return author.id !== a.id;
            });
            this.setState({
                selectedAuthorModify: getBlankAuthor(),
                pendingAuthors: newAuthorList,
                numberOfPages: Math.ceil(newAuthorList.length/pageSize),
                modifyAuthor: false,
                modifyError: false
            });
        }).catch(() => {
            this.setState({
                modifyError: true
            })
        });
    }

    handleModChange(event:React.FormEvent<HTMLInputElement>, field:string) {
        let newModifyAuthor = this.state.selectedAuthorModify;
        switch(field) {
            case 'first_name':
                newModifyAuthor.first_name = event.currentTarget.value;
                this.setState({
                    selectedAuthorModify: newModifyAuthor
                });
                break;
            case 'middle_name':
                newModifyAuthor.middle_name = event.currentTarget.value;
                this.setState({
                    selectedAuthorModify: newModifyAuthor
                });
                break;
            case 'last_name':
                newModifyAuthor.last_name = event.currentTarget.value;
                this.setState({
                    selectedAuthorModify: newModifyAuthor
                });
                break;
            case 'bio':
                newModifyAuthor.bio = event.currentTarget.value;
                this.setState({
                    selectedAuthorModify: newModifyAuthor
                });
                break;
            default:
                break;
        }
    }

    //pagination related methods
    nextPage() {
        if(this.state.page < this.state.numberOfPages) {
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
        if(page <= this.state.numberOfPages && page > 0) {
            this.setState({
                page: page
            })
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <ClipLoader css={'display:block;margin:0 auto;'} size={200} color={"#123abc"} loading={this.state.loading} />
            );
        }

        if(this.state.pageError !== '') {
            return (
                <Alert variant="danger">
                    <h2>{this.state.pageError}</h2>
                </Alert>
            );
        }

        if(this.state.pendingAuthors.length === 0) {
           return (
            <Row className="pt-5">
                <Col></Col>
                <Col xs={6}>
                    <Alert variant="warning">
                        <h2>There are no pending authors at this time.</h2>
                    </Alert>
                </Col>
                <Col></Col>
            </Row>
           );
        }

        return (
            <div>
                <Modal show={this.state.selectedAuthor !== undefined}>
                    <Modal.Header>
                        <h4 className="font-weight-bold col-12">Confirm Approval
                        <button className="close" onClick={this.handleApprovalClose}>x</button>
                        </h4>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to approve author id: {this.state.selectedAuthor} ?
                        <Alert className="text-center" variant={'danger'} show={this.state.approvalError}>Error approving author!</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-success" onClick={this.handleAuthorApproval}>Confirm</Button>
                        <Button className="btn-danger" onClick={this.handleApprovalClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modifyAuthor}>
                    <Modal.Header>
                        <h4 className="font-weight-bold col-12">Modify and Approve
                        <button className="close" onClick={this.handleModifyClose}>x</button>
                        </h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="modFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control value={this.state.selectedAuthorModify.first_name} type="text" onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleModChange(ev, 'first_name');}}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="modMiddleName">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control value={this.state.selectedAuthorModify.middle_name} type="text" onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleModChange(ev, 'middle_name');}}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="modLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control value={this.state.selectedAuthorModify.last_name} type="text" onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleModChange(ev, 'last_name');}}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="modBio">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control value={this.state.selectedAuthorModify.bio} as="textarea" onChange={(ev:React.FormEvent<HTMLInputElement>) =>{this.handleModChange(ev, 'bio');}}></Form.Control>
                            </Form.Group>
                        </Form>
                        <Alert className="text-center" variant={'danger'} show={this.state.modifyError}>Error modifying author!</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-success" onClick={this.handleAuthorModify}>Confirm</Button>
                        <Button className="btn-danger" onClick={this.handleModifyClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
                <Row>
                    <Col>
                        <h1 className="p-3">Authors Pending Approval</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr  className="table-primary">
                                        <th className="clickable" style={{ minWidth:75 }} onClick={() => {this.onSort('id')}}>Id {this.renderSortIcon('id')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('first_name')}}>First Name {this.renderSortIcon('first_name')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('middle_name')}}>Middle Name {this.renderSortIcon('middle_name')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('last_name')}}>Last Name {this.renderSortIcon('last_name')}</th>
                                        <th>Bio</th>
                                        <th className="clickable" style={{ minWidth:150 }} onClick={() => {this.onSort('created_dt')}}>Date Created {this.renderSortIcon('created_dt')}</th>
                                        <th>Approve</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTable()}
                                </tbody>
                            </Table>
                            <Paginator 
                                    list={this.state.pendingAuthors}
                                    page={this.state.page}
                                    numberOfPages={this.state.numberOfPages}
                                    toPage={this.toPage}
                                    nextPage={this.nextPage}
                                    prevPage={this.prevPage}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}