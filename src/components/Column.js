import React, {Component} from 'react';

class Column extends Component {

    render() {
        let cl = 'col';
        if (this.props.size !== undefined) {
            cl += '-' + this.props.size;
        }
        if (this.props.offset !== undefined) {
            cl += ' offset-' + this.props.offset;
        }
        //sm
        if (this.props.smSize !== undefined) {
            cl += ' col-sm-' + this.props.smSize;
        }
        if (this.props.smOffset !== undefined) {
            cl += ' offset-sm-' + this.props.smOffset;
        }
        //md
        if (this.props.mdSize !== undefined) {
            cl += ' col-md-' + this.props.mdSize;
        }
        if (this.props.mdOffset !== undefined) {
            cl += ' offset-md-' + this.props.mdOffset;
        }
        //lg
        if (this.props.lgSize !== undefined) {
            cl += ' col-lg-' + this.props.lgSize;
        }
        if (this.props.lgOffset !== undefined) {
            cl += ' offset-lg-' + this.props.lgOffset;
        }
        //xl
        if (this.props.xlSize !== undefined) {
            cl += ' col-xl-' + this.props.xlSize;
        }
        if (this.props.xlOffset !== undefined) {
            cl += ' offset-xl-' + this.props.xlOffset;
        }
        if (this.props.colClass !== undefined) {
            cl += ' ' + this.props.colClass;
        }
        return <div className={cl} style={this.props.style}>
            {this.props.children}
        </div>;
    }

} export default Column;