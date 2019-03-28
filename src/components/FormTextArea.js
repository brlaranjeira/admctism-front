import React, {Component} from 'react';

class FormTextArea extends Component {


    //numero sequencial para nomear componentes sem propriedade name
    static idNum = 0;
    static getNextIdNum() {
        const ret = FormTextArea.idNum;
        FormTextArea.idNum++;
        return ret;
    }

    render () {

        const name = this.props.name !== undefined ? this.props.name : 'textarea-'+FormTextArea.getNextIdNum().toString();
        const title = this.props.title;
        const value = this.props.value !== undefined ? this.props.value : '';
        const onChange = this.props.onChange !== undefined ? this.props.onChange : null;
        const cols = this.props.cols !== undefined ? this.props.cols : 30;
        const rows = this.props.rows !== undefined ? this.props.rows : 10;
        const disabled = this.props.disabled !== undefined && this.props.disabled;
        const required = this.props.required !== undefined && this.props.required !== false;
        let warningMessage;
        if (this.props.warningMessage !== undefined) {
            warningMessage = this.props.warningMessage;
        } else {
            warningMessage = 'Campo ' + title + ' não informado';
        }

        const label = title !== undefined ? <label htmlFor={name}>{title}</label> : null;
        const textAreaId = name.endsWith('[]') ?
            name.substr(0,name.length-2) :
            name;
        const textarea =
            <textarea
                required={required}
                disabled={disabled}
                warningMessage={warningMessage}
                onChange={onChange}
                value={value}
                className={'form-control'}
                name={name}
                id={textAreaId}
                cols={cols}
                rows={rows}
            >
            </textarea>;
        return <div className={'form-group'}>
            {label}
            {textarea}
        </div>;
    }
}
export default FormTextArea;