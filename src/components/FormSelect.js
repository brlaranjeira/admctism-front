import React, {Component} from 'react';

class FormSelect extends Component {

    render () {
        const name = this.props.name !== undefined ? this.props.name : 'select-nameless';
        const title = this.props.title !== undefined ? this.props.title : name;
        const value = this.props.value !== undefined ? this.props.value : '';
        const onChange = this.props.onChange !== undefined ? this.props.onChange : null;
        const disabled = this.props.disabled !== undefined && this.props.disabled;
        const required = this.props.required !== undefined && this.props.required !== false;
        const warningMessage = this.props.warningMessage !== undefined ?
            this.props.warningMessage :
            ('Campo ' + title + ' não informado');

        const label = title !== undefined ? <label htmlFor={name}>{title}</label> : null;
        const selId = name.endsWith('[]') ?
            name.substr(0,name.length-2) :
            name;

        //const options = ;
        const select = <select
            required={required}
            disabled={disabled}
            onChange={onChange}
            warningMessage={warningMessage}
            value={value !== undefined ? value : ''}
            className={'form-control'}
            name={name}
            id={selId} >
                { this.props.options.map( vl => {
                    return <option value={vl.id}>{vl.name}</option>
                })}
        </select>;
        return <div className={'form-group'}>
            {label}
            {select}
        </div>;
    }
}
export default FormSelect;