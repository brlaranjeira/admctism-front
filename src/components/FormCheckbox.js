import React, {Component} from 'react';

class FormCheckbox extends Component {


    //numero sequencial para nomear componentes sem propriedade name
    static idNum = 0;
    static getNextIdNum() {
        const ret = FormCheckbox.idNum;
        FormCheckbox.idNum++;
        return ret;
    }

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state={};
    }

    componentDidUpdate() {
        this.inputRef.current.checked = this.props.value;
    }



    render() {
        const name = this.props.name !== undefined ? this.props.name : 'checkbox-'+FormCheckbox.getNextIdNum().toString();
        const title = this.props.title !== undefined ? this.props.title : name;
        const defaultValue = this.props.value !== undefined && this.props.value === true;
        const onChange = this.props.onChange !== undefined ? this.props.onChange : null;
        const disabled = this.props.disabled !== undefined && this.props.disabled;

        return <div className="form-check">
            <input onChange={() => onChange(this.inputRef.current.checked)} ref={this.inputRef} className="form-check-input" type="checkbox" defaultChecked={defaultValue} id="defaultCheck1"/>
            <label disabled={disabled} className="form-check-label" htmlFor="defaultCheck1">
                {title}
            </label>
        </div>
    }

} export default FormCheckbox;



