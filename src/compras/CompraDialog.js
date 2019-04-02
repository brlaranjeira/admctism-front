import React, { Component } from 'react';
import Row from "../components/Row";
import Column from "../components/Column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import 'react-confirm-alert/src/react-confirm-alert.css'

import Request from '../utils/Request';
import JWT from "../utils/JWT";
import BoardNovoOrcamento from "./BoardNovoOrcamento";
import {Alert} from "react-bootstrap";
import SpanEditavel from "./SpanEditavel";

class CompraDialog extends Component {


    componentDidMount() {
        Request.get('/admctism/ajax/compras/gettipossolicitacao.php',new FormData(), ({data}) => {
            this.setState(() => {
                return {tiposSolicitacao: JSON.parse(data.tipos).map( t => {
                        return {
                            id:t.id,
                            name:t.descricao
                        }
                    })}
            });
        });
        Request.get('/admctism/ajax/compras/gettiposdespesa.php',new FormData(), ({data}) => {
            this.setState({tiposDespesa: JSON.parse(data.tipos).map( t => {
                    return {
                        id:t.id,
                        name:t.descricao
                    }
            })});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.compra === null && this.props.compra !== null) || ( prevProps.compra !== null && this.props.compra !== null && prevProps.compra.id !== this.props.compra.id )) {
            const user = JWT.getPayload();
            debugger;
            this.setState({
                canEdit: JSON.parse(user.grupo).admin || user.username === this.props.compra.usuario.login
            });
        }
    }

    constructor(props) {
        super(props);

        this.state={
            tiposDespesa:[{id:-1,name:'Carregando...'}],
            tiposSolicitacao:[{id:-1,name:'Carregando...'}],
            canEdit: false
        };
        this.downloadArquivoOrcamento = this.downloadArquivoOrcamento.bind(this);
        this.downloadArquivoCompra = this.downloadArquivoCompra.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.addOrcamento = this.addOrcamento.bind(this);
        this.excluiOrcamento = this.excluiOrcamento.bind(this);
        this.onChangeProp = this.onChangeProp.bind(this);

    }

    downloadArquivoOrcamento( orcamento ) {
        const tag = document.createElement('a');
        tag.href = 'http://' + Request.server + '/admctism/ajax/compras/getarquivoorcamento.php?id='+orcamento.id;
        tag.download = orcamento.arquivo.originalName;
        tag.click();
    }

    downloadArquivoCompra ( compra ) {
        const arquivo = JSON.parse(compra.arquivo);
        const tag = document.createElement('a');
        tag.href = 'http://' + Request.server + '/admctism/ajax/compras/getarquivocompra.php?compra='+compra.id;
        tag.download = arquivo.originalName;
        tag.click();
    }

    showMessage(message,type='success',time=3500) {
        this.setState({ mensagem: {
                text: message,
                type: type
        }}, () => {
            setTimeout( () => {
                this.setState({mensagem:undefined})
            },3500);
        } );
    }

    addOrcamento (compra,orcamento,message,success) {
        this.props.addOrcamento( compra, orcamento, message, success);
        this.showMessage(message,success ? 'success' : 'error');
    }

    excluiOrcamento ( orcamento ) {
        if (window.confirm('Tem certeza? Esta ação não poderá ser desfeita.')) {
            const fd = new FormData();
            fd.append('orcamento',orcamento.id);
            Request.post('/admctism/ajax/compras/deleteorcamento.php',fd,response => {
                this.showMessage(response.data.message);
                this.props.excluiOrcamento(orcamento);
            } , response => alert(JSON.stringify(response)));
        }
    };

    onChangeProp(prop,evt) {
        //TODO: AJAX
        this.props.onPropChange(prop,evt);
    }

    render() {
        if (this.props.compra == null) {
            return null;
        }
        const compra = this.props.compra;
        const user = JWT.getPayload();
        let orcamentos = JSON.parse(compra.orcamentos);
        orcamentos = orcamentos.map( o => {
             o.arquivo=JSON.parse(o.arquivo);
             return o;
         });
        const spanProjeto = compra.codProjeto == null ? <span>Não vinculada a nenhum projeto</span> : <span>Vinculada ao projeto: <strong>{compra.codProjeto}</strong></span>;

        let rowObs;
        if (compra.obs === null || compra.obs.length === 0) {
            rowObs = null;
        } else {
            rowObs = <Row>
                <Column>Observação</Column>
                <Column>{compra.obs}</Column>
            </Row>
        }

        let rowOutroArq = null;
        if ( JSON.parse(compra.arquivo) === null ) {
            rowOutroArq = null;
        } else {
            rowOutroArq = <Row>
                <Column>Arquivo Adicional</Column>
                <Column><button onClick={() => this.downloadArquivoCompra(compra)} className={'px-0 btn btn-link'}>{JSON.parse(compra.arquivo).originalName}<i className={'pi pi-download'}></i> </button></Column>
            </Row>
        }

        let spanValorMedio;
        if (orcamentos.length === 0) {
            spanValorMedio = null;
        } else {
            let avg = orcamentos
                .map(o => Number.parseFloat(o.valor))
                .reduce((acc, curr) => acc + curr,0);
            avg /= orcamentos.length;
            spanValorMedio = <SpanEditavel editPermission={false} label={'Valor Médio (R$)'} value={avg.toFixed(2)}/>;
        }

        let alert;
        if ( this.state.mensagem === undefined ) {
            alert = null;
        } else {
            alert = <Alert bsClass={'alertDialog alert'} bsStyle={this.state.mensagem.type}>
                <div className={'d-flex justify-content-between'}>
                    <div>ADMCTISM</div>
                    <div onClick={() => this.setState({mensagem:undefined})} ><i className="clickable fas fa-times"></i></div>
                </div>
                <hr/>
                { Array.isArray(this.state.mensagem.text) && this.state.mensagem.text.map( m => <p>{m}</p> ) || this.state.mensagem.text }
            </Alert>;
        }

        const orcamentosComponents = orcamentos.map( (o, idx ) => {
            return <Column size={'4'}>
                <div className={'d-flex justify-content-around flex-column p-2'} style={{border: '1px solid black',height:'100%',minHeight:'175px'}}>
                    <div style={{width:'95%'}} className={'d-flex justify-content-between '}>
                        <span>Orcamento #{(idx+1)}</span>
                        {
                            this.state.canEdit
                                ? <span><i onClick={() => this.excluiOrcamento(o)} style={{cursor: 'pointer', color: 'red'}} className="pi pi-trash"></i></span>
                                : null
                        }
                    </div>
                    <div style={{width:'95%'}} className={'d-flex justify-content-between'}>
                        <span>Valor</span>
                        <strong> R$ {Number.parseFloat(o.valor).toFixed(2)} </strong>
                    </div>
                    <div>
                        <Button style={{width:'95%'}} onClick={() => this.downloadArquivoOrcamento(o)} label={'Download do Arquivo'}/>
                    </div>
                </div>
            </Column>;
        });

        let boardNovoOrcamento;
        if (orcamentos.length >= 3 || !this.state.canEdit ) {
            boardNovoOrcamento = null;
        } else  {
            boardNovoOrcamento = <Column size={'4'}>
                <BoardNovoOrcamento addOrcamento={(compra,orcamento,message,success) => this.addOrcamento(compra,orcamento,message,success)} compra={compra}/>
            </Column>
        }


        const snOptions = [ {id:'s',name:'Sim'} , {id:'n',name:'Não'} ];
        const infoGerais = [
            {label:  'Solicitante', value: compra.usuario.nome, locked: true},
            {label:  'Estado da Tramitação', value: compra.estado.descricao, type:'select', locked: true},
            {label:  'Compra via', value: compra.tipoSolicitacao.descricao , type: 'select', values:this.state.tiposSolicitacao},
            {label:  'Despesa com', value: compra.tipoDespesa.descricao , type: 'select', values:this.state.tiposDespesa},
            {label:  'Despesa recorrente', value: compra.despesaRecorrente ? "s" : "n", type: 'select',values: snOptions},
            {label:  'Quantidade', value: compra.quantidade , mask:'000000'},
            {label:  'Marca / Modelo de referência', value: compra.modelo}
        ];
        return <div className={'px-3'}>
            {alert}
            <Card title={'Dados Gerais'}>
                <Row>
                {infoGerais.map( info => {
                    return (
                        <Column mdSize={'6'}>
                            <SpanEditavel
                                label={info.label}
                                editPermission={(info.locked === undefined || !info.locked) && this.state.canEdit}
                                value={info.value}
                                mask={info.mask}
                                type={info.type}
                                values={info.values}
                            />
                        </Column>
                    );
                })}
                </Row>

                {rowObs}
                {rowOutroArq}
            </Card>
            <Card title={'Descrição'}>
                <SpanEditavel type={'textarea'} cols={150}  editPermission={this.state.canEdit} value={compra.descricao}/>
            </Card>
            <Card title={'Justificativa'}>
                <SpanEditavel type={'textarea'} cols={150} editPermission={this.state.canEdit} value={compra.justificativa} />
            </Card>
            <Card title={"Orcamentos"}>
                {spanValorMedio}
                <Row>
                    { orcamentosComponents }
                    { boardNovoOrcamento }
                </Row>
            </Card>
        </div>
    }

} export default CompraDialog;