import React, { Component } from 'react';
import {Button} from "primereact/button";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormTextArea from "../components/FormTextArea";

class SpanEditavel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editando: false,
            value: this.props.value !== undefined ? this.props.value : ""
        };
        this.label = this.props.label !== undefined ? this.props.label : "";
        this.type = this.props.type !== undefined ? this.props.type : 'text';
        this.values = this.props.values !== undefined ? this.props.values : [];
        this.toggleEdicao = this.toggleEdicao.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.cancelEdicao= this.cancelEdicao.bind(this);
    }

    cancelEdicao () {
        this.setState(prev => {
            return {
                value: prev.oldValue,
                editando: false
            }
        });
    }

    toggleEdicao () {
        this.setState( prev => {
            return {
                editando: !prev.editando,
                oldValue: prev.value
            }
        } );
    }

    onChangeValue (e) {
        this.setState({value:e.target.value});
    }

    copyToClipboard( str ) {
        const el = document.createElement('textarea');  // Create a <textarea> element
        el.value = str;                                 // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        const selected =
            document.getSelection().rangeCount > 0        // Check if there is any content selected previously
                ? document.getSelection().getRangeAt(0)     // Store selection if found
                : false;                                    // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
            document.getSelection().addRange(selected);   // Restore the original selection
        }
    }


    render() {

        let value = this.state.value !== undefined ? this.state.value : "";
        const canEdit = this.props.editPermission !== undefined ? this.props.editPermission : false;

        let botaoToggle = null;
        let botaoCancel = null;
        let textField;
        if ( !this.state.editando ) {
            if (this.type.toLowerCase() === 'select') {
                const option = this.values.find( v => v.id === value );
                if (option !== undefined) {
                    value = option.name;
                }
            }
            textField = <span style={{padding: '6px',border: '1px solid #ccc', width:'100%'}}>{value}</span>;
        } else {
            switch (this.type.toLowerCase()) {
                case 'text':
                    textField = <FormInput style={{width:'100%'}} value={value} onChange={ e => this.onChangeValue(e)} />
                    break;
                case 'select':
                    textField = <FormSelect style={{width:'100%'}} value={value} onChange={ e => this.onChangeValue(e)} options={this.values} />
                    break;
                case 'textarea':
                    textField = <FormTextArea cols={this.props.cols} style={{width:'100%'}} value={value} onChange={ e => this.onChangeValue(e)} />
                    break;
            }
        }

        if ( canEdit ) {
            const btnClass = (this.state.editando ? "p-button-success" : "p-button-info");
            const btnIcon = this.state.editando ? 'pi pi-check' : 'pi pi-pencil';
            botaoToggle = <Button onClick={() => this.toggleEdicao()} icon={btnIcon} style={{width:'35px',border:'1px solid #ccc'}} className={btnClass}/>;
            if ( this.state.editando ) {
                botaoCancel = <Button onClick={this.cancelEdicao} icon={'pi pi-trash'}  style={{width:'35px', border:'1px solid #ccc'}} className={'p-button-secondary'}/>
            }
        }

        let copyButton = null;
        if ( !this.state.editando ) {
            copyButton = <Button onClick={() => {this.copyToClipboard(value)}} title='Copiar para área de transferência' icon={'pi pi-copy'} style={{width:'35px', border:'1px solid #ccc'}} className='p-button-secondary'/>;
        }


        return (
            <div style={{paddingTop:'5px',paddingBottom:'5px'}}>
                <span>{this.label}</span>
                <div style={{ width : '100%' }} className='p-inputgroup'>
                    { textField }
                    { botaoCancel }
                    { botaoToggle }
                    { copyButton }
                </div>
            </div>
        );
    }


} export default SpanEditavel;