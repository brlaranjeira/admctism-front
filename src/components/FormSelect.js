import React, {Component} from 'react';

class FormSelect extends Component {

    //numero sequencial para nomear componentes sem propriedade name
    static idNum = 0;
    static getNextIdNum() {
        const ret = FormSelect.idNum;
        FormSelect.idNum++;
        return ret;
    }

    render () {
        const name = this.props.name !== undefined ? this.props.name : 'select-' + FormSelect.getNextIdNum().toString();
        const title = this.props.title !== undefined ? this.props.title : name;
        const value = this.props.value !== undefined ? this.props.value : '';
        const onChange = this.props.onChange !== undefined ? this.props.onChange : null;
        const disabled = this.props.disabled !== undefined && this.props.disabled;
        const required = this.props.required !== undefined && this.props.required !== false;

        const styleSelect = this.props.styleSelect !== undefined ? this.props.styleSelect : {};
        const styleLabel = this.props.styleLabel !== undefined ? this.props.styleLabel : {};
        const style = this.props.style !== undefined ? this.props.style : {};

        let warningMessage;
        if (this.props.warningMessage !== undefined) {
            warningMessage = this.props.warningMessage;
        } else {
            warningMessage = 'Campo ' + title + ' não informado';
        }
        const selId = name.endsWith('[]') ? name.substr(0,name.length-2) : name;

        /**
         * COMPONENTS
         */
        const label = title !== undefined ? <label style={styleLabel} htmlFor={name}>{title}</label> : null;
        const options = this.props.options.map( vl => {
            return <option value={vl.id}>{vl.name}</option>
        });
        const select = <select
                            required={required}
                            disabled={disabled}
                            onChange={onChange}
                            warningMessage={warningMessage}
                            value={value}
                            className={'form-control'}
                            name={name}
                            style={styleSelect}
                            id={selId} >
                            { options }
                        </select>;
        return <div style={style} className={'form-group'}> {label} {select} </div>;
    }
} export default FormSelect;