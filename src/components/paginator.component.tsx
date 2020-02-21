import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

interface Props {
    list:any[],
    page:number,
    numberOfPages:number,
    toPage: (p:number) => void,
    nextPage: () => void,
    prevPage: () => void
}

export default class Paginator extends React.Component<Props, any> {

    render() {
        let leftNeighbor = null;
        let rightNeighbor = null;
        if (this.props.page - 1 > 1) {
            let p = this.props.page-1;
            leftNeighbor = (<>
                <Pagination.Item onClick={() => {this.props.toPage(1)}}>1</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => {this.props.toPage(p)}}>{p}</Pagination.Item>
            </>);
        }  else {
            leftNeighbor = (<>
            </>)
        }
        if (this.props.numberOfPages - this.props.page > 1) {
            let p = this.props.page + 1;
            rightNeighbor = (<>
                <Pagination.Item onClick={() => {this.props.toPage(p)}}>{p}</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => {this.props.toPage(this.props.numberOfPages)}}>{this.props.numberOfPages}</Pagination.Item>
            </>)
        } else {
            rightNeighbor = (<>
            </>)
        }
        return (


            <Pagination>
                <Pagination.First onClick={() =>{this.props.toPage(1)}}/>
                <Pagination.Prev onClick={this.props.prevPage}/>
                {leftNeighbor}
                <Pagination.Item active>{this.props.page}</Pagination.Item>
                {rightNeighbor}
                <Pagination.Next onClick={this.props.nextPage}/>
                <Pagination.Last onClick={() =>{this.props.toPage(this.props.numberOfPages)}}/>
            </Pagination>
        )
    }
}