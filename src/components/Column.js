import React, {Component} from 'react';

class Column extends Component {

    render() {
        let cl = 'col';
        if (this.props.size !== undefined) {
            cl += '-' + this.props.size;
        }
        //sm
        if (this.props.smSize !== undefined) {
            cl += ' col-sm-' + this.props.smSize;
        }
        //md
        if (this.props.mdSize !== undefined) {
            cl += ' col-md-' + this.props.mdSize;
        }
        //lg
        if (this.props.lgSize !== undefined) {
            cl += ' col-lg-' + this.props.lgSize;
        }
        //xl
        if (this.props.xlSize !== undefined) {
            cl += ' col-xl-' + this.props.xlSize;
        }
        if (this.props.colClass !== undefined) {
            cl += ' ' + this.props.colClass;
        }
        return <div className={cl}>
            {this.props.children}
        </div>;
    }

} export default Column;