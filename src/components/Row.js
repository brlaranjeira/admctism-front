import React, { Component } from 'react';

class Row extends Component {
    render() {
        return <div className={'row ' + this.props.rowClass}>
            {this.props.children}
        </div>;
    }
} export default Row;