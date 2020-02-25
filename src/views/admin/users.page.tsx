import React from 'react';
import Props from '../../App';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Paginator from '../../components/paginator.component'
import ClipLoader from 'react-spinners/ClipLoader';
import UserService from '../../services/user.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap';
import AuthenticationService from '../../services/authentication.service';

interface State {
    users: any,
    loading: boolean,
    selectedUser?:number,
    activationError:boolean,
    page:number,
    numberOfPages:number,
    sort: {
        column:string,
        direction:string
    },
    pageError:string
}

const userService = new UserService();
const authService = new AuthenticationService();
const pageSize = 5;

export class AdminUsersPage extends React.Component<any, State> {
    
   constructor(props:any) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            selectedUser: undefined,
            activationError: false,
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
        this.handleActivationToggle = this.handleActivationToggle.bind(this);
        this.handleUserActivation = this.handleUserActivation.bind(this);
        this.handleUserDeactivation = this.handleUserDeactivation.bind(this);
        this.onSort = this.onSort.bind(this);
        this.renderSortIcon = this.renderSortIcon.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.toPage = this.toPage.bind(this);
    }

    componentDidMount() {
        userService.getAll().then((users) => {
            this.setState({
                users: users,
                page: 1,
                numberOfPages: Math.ceil(users.length/pageSize),
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
        return this.state.users.slice(pageSize * (this.state.page-1), pageSize * (this.state.page-1) + pageSize).map((user:any, index:number) => {
            const {id, username, email, first_name, last_name, created_dt, active} = user;
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                    <td>{this.formatDate(created_dt)}</td>
                    <td>
                        <Form className="text-center">
                            <Form.Check type="switch" disabled={authService.getUserName() === username} checked={active} id={"user_active_toggle" + id} label="" onChange={()=>{this.handleActivationToggle(user);}}/>
                        </Form>
                    </td>
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
        const sorted = this.state.users;
        sorted.sort((a:any,b:any) => {
            if(column === 'id') {
                if(a[column] > b[column]) {
                    return -1;
                } else if(a[column] > b[column]) {
                    return 1;
                } else {
                    return 0;
                }
            } else if(column === 'active') {
                if(a[column] && !b[column]) {
                    return 1;
                } else if(!a[column] && b[column]) {
                    return -1;
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
            users: sorted,
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

    handleActivationToggle(user:any) {
        if (!user.active) {
            this.handleUserActivation(user);
        } else {
            this.handleUserDeactivation(user);
        }
    }

    handleUserActivation(user:any) {
        userService.activate(user.id).then(() => {
            let usersUpdated = this.state.users;
            console.log(usersUpdated);
            let userIdx = usersUpdated.findIndex((u:any) => u.id === user.id);
            usersUpdated[userIdx].active = true;
            this.setState({
                users: usersUpdated
            })
        }).catch(() => {
            this.setState({
                activationError: true
            })
        });
    }

    handleUserDeactivation(user:any) {
        userService.deactivate(user.id).then(() => {
            let usersUpdated = this.state.users;
            let userIdx = usersUpdated.findIndex((u:any) => u.id === user.id);
            usersUpdated[userIdx].active = false;
            console.log(usersUpdated);
            this.setState({
                users: usersUpdated
            })
        }).catch(() => {
            this.setState({
                activationError: true
            })
        });
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

        return (
            <div>
                <Row>
                    <Col>
                        <h1 className="p-3">Manage Users</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr  className="table-primary">
                                        <th className="clickable" style={{ minWidth:75 }} onClick={() => {this.onSort('id')}}>Id {this.renderSortIcon('id')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('username')}}>Username {this.renderSortIcon('username')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('email')}}>Email {this.renderSortIcon('email')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('first_name')}}>First Name {this.renderSortIcon('first_name')}</th>
                                        <th className="clickable" onClick={() => {this.onSort('last_name')}}>Last Name {this.renderSortIcon('last_name')}</th>
                                        <th className="clickable" style={{ minWidth:150 }} onClick={() => {this.onSort('created_dt')}}>Date Created {this.renderSortIcon('created_dt')}</th>
                                        <th className="clickable" style={{ minWidth:50 }} onClick={() => {this.onSort('active')}}>Active {this.renderSortIcon('active')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTable()}
                                </tbody>
                            </Table>
                            <Paginator 
                                    list={this.state.users}
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