import React, { Component } from 'react';
import FormInput from "../components/FormInput";
import Row from "../components/Row";
import Column from "../components/Column";
import Request from '../utils/Request';

class BoardNovoOrcamento extends Component {

    constructor(props) {
        super(props);
        this.compra=props.compra;
        this.state = {
            editando: false,
        };
        this.enviaOrcamento = this.enviaOrcamento.bind(this);
        this.closeBoard = this.closeBoard.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    enviaOrcamento() {
        let valid = true;
        let message = [];

        //VALIDACAO
        if (this.state.valor === undefined || Number.parseFloat(this.state.valor) === 0.0 ){
            valid = false;
            message.push('Valor inválido');
        }
        if (this.state.arquivo === undefined || this.state.arquivo.length === 0) {
            valid = false;
            message.push('Arquivo invalido');
        }

        if (valid) {
            this.setState({message:undefined});
            const fd = new FormData();
            fd.append('compra',this.compra.id);
            fd.append('valor',this.state.valor);
            fd.append('arq',document.getElementById('arquivo').files[0]);
            Request.post('/admctism/ajax/compras/addorcamento.php',fd, (({data}) => {
                this.props.addOrcamento( this.compra , JSON.parse(data.orcamento), data.message, data.success );
                this.setState({
                    editando: false,
                    valor: undefined,
                    arquivo: undefined
                })
            }));
        } else {
            this.setState({message:message})
        }
    }

    closeBoard() {
        this.setState({
            editando: false,
            valor: undefined,
            arquivo:undefined
        });
    }

    handleChange(prop,evt) {
        const valor = evt.target.value;
        const obj = {[prop]: valor};
        this.setState(obj);
    }


    render() {
        let rowAviso = null;
        if (this.state.message !== undefined && this.state.message.length > 0) {
            rowAviso = <Row><Column>
                {this.state.message.map( ( text , idx ) => {
                    return <span style={{color:'red'}}>{idx > 0 ? <br/> : null}{text}</span>;
                })}
            </Column></Row>
        }
        let content;
        if (!this.state.editando) {
            content = <span>
                Novo Orcamento<br/>
                <i onClick={() => this.setState({editando:true})} style={{
                    border:'3px dashed #90c7ff',
                    borderRadius:'100%',
                    cursor:'pointer'

                }} className={'pi pi-plus'}>
                </i>
            </span>;
        } else {
            content = <div className={'p-3'}>
                <div className={'float-right'}><i onClick={() => this.closeBoard() } style={{cursor:'pointer'}} className={'pi pi-times'}></i></div><br/>
                { rowAviso }
                <Row>
                   <Column>
                        <FormInput mask={'R0000000.00'} value={this.state.valor} onChange={evt => this.handleChange('valor',evt)} type='text' title='Valor' name='valor' />
                   </Column>
                    <Column>
                        <FormInput value={this.state.arquivo} onChange={evt => this.handleChange('arquivo',evt)} type='file' title='Arquivo' name='arquivo' />
                    </Column>
                </Row>
                <button onClick={this.enviaOrcamento} className={'btn btn-block btn-primary'}>Enviar</button>
            </div>;
        }
        return <div style={{border:'1px solid black'}} >
            {content}
        </div>;
    }
} export default BoardNovoOrcamento;