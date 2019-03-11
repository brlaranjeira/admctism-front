import React, {Component} from 'react';
import StringMask from "string-mask";

class FormInput extends Component {

    //numero sequencial para nomear componentes sem propriedade name
    static idNum = 0;
    static getNextIdNum() {
        const ret = FormInput.idNum;
        FormInput.idNum++;
        return ret;
    }

    render () {
        const title = this.props.title;
        const name = this.props.name !== undefined ? this.props.name : 'input-' + FormInput.getNextIdNum().toString();
        const value = this.props.value !== undefined ? this.props.value : '';
        const small = this.props.small !== undefined ? <small>{this.props.small}</small> : null;
        const type = this.props.type !== undefined ? this.props.type : 'text';
        const inputId = name.endsWith('[]') ? name.substr(0,name.length-2) : name;
        const disabled = this.props.disabled !== undefined && this.props.disabled;
        const required = this.props.required !== undefined && this.props.required !== false;
        const styleInput = this.props.styleInput !== undefined ? this.props.styleInput : null;
        const styleLabel = this.props.styleLabel !== undefined ? this.props.styleLabel : null;
        const style = this.props.style !== undefined ? this.props.style : null;
        let warningMessage;
        if (this.props.warningMessage !== undefined) {
            warningMessage = this.props.warningMessage;
        } else {
            warningMessage = 'Campo ' + title + ' não informado';
        }

        /**
         * MASK
         */
        const mask = this.props.mask !== undefined ? this.props.mask : undefined;
        let onChange;
        if (mask === undefined) {
            onChange = this.props.onChange !== undefined ? this.props.onChange : null;
        } else {
            onChange = evt => {
                let pattern = mask;
                let rev = pattern.startsWith('R');
                if (rev) {
                    pattern = pattern.substr(1);
                }
                const exclusiveChars = /[09#AaSUL]/g;
                let toRemove = Array.from(pattern.replace(exclusiveChars,''));
                toRemove = toRemove.filter( (v,i,self) => self.indexOf(v) === i );
                toRemove.forEach( c => {
                    while (evt.target.value.includes(c)) {
                        evt.target.value = evt.target.value.replace(c,'');
                    }
                });
                evt.target.value = StringMask.apply(evt.target.value,pattern,{reverse:rev});
                toRemove.forEach( c => {
                    while (evt.target.value.endsWith(c)) {
                        evt.target.value=evt.target.value.substr(0,evt.target.value.length-1);
                    }
                } );
                this.props.onChange(evt);
            }
        }

        /**
         * COMPONENTES
         */
        const label = title !== undefined ? <label style={styleLabel} htmlFor={name}>{title} {small} </label> : null;
        const input = <input
            mask={mask}
            warningMessage={warningMessage}
            required={required}
            disabled={disabled}
            type={type}
            onChange={onChange}
            value={value}
            className={'form-control'}
            name={this.props.name}
            style={styleInput}
            id={inputId} />;

        return <div style={style} className={'form-group'}> {label} {input}  </div>;
    }
} export default FormInput;