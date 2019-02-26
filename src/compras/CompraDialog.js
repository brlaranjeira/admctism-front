import React, { Component } from 'react';
import Row from "../components/Row";
import Column from "../components/Column";
import { ProgressSpinner } from "primereact/progressspinner";
import { ScrollPanel} from "primereact/scrollpanel";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import Request from '../utils/Request';
import JWT from "../utils/JWT";
import BoardNovoOrcamento from "./BoardNovoOrcamento";
import { Dialog } from "primereact/dialog";
import {Alert} from "react-bootstrap";

class CompraDialog extends Component {


    constructor(props) {
        super(props);
        this.state={};
        this.addOrcamento = this.addOrcamento.bind(this);
    }

    downloadArquivoOrcamento( orcamento ) {
/*        const formdata = new FormData();
        formdata.append('id', arquivo.id );*/
        const tag = document.createElement('a');
        tag.href = 'http://' + Request.server + '/admctism/ajax/compras/getarquivoorcamento.php?id='+orcamento.id;
        tag.download = orcamento.arquivo.originalName;
        tag.click();
    }

    downloadArquivoCompra ( compra ) {
        debugger;
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
            } }, () => {
            setTimeout( () => {
                this.setState({mensagem:undefined})
            },3500);
        } );
    }

    addOrcamento (compra,orcamento,message,success) {
        this.props.addOrcamento( compra,orcamento,message,success );
        this.showMessage(message,success ? 'success' : 'error');
    }

    excluiOrcamento = ( orcamento ) => {
        if (window.confirm('Tem certeza? Esta ação não poderá ser desfeita.')) {
            const fd = new FormData();
            fd.append('orcamento',orcamento.id);
            Request.post('/admctism/ajax/compras/deleteorcamento.php',fd,response => {
                this.showMessage(response.data.message);
                debugger;
                this.props.excluiOrcamento(orcamento);
            } , response => alert(JSON.stringify(response)));
        }
    };

    render() {
        if (this.props.compra == null) {
            return null;
        }
        const compra = this.props.compra;
        const isOwner = JWT.getPayload().username === compra.usuario.uid;
        const orcamentos = JSON.parse(compra.orcamentos).map(o => {o.arquivo=JSON.parse(o.arquivo);return o;});

        const spanProjeto = compra.codProjeto == null ? <span>Não vinculada a nenhum projeto</span> : <span>Vinculada ao projeto: <strong>{compra.codProjeto}</strong></span>;

        let rowObs = null;
        if ( compra.obs !== null && compra.obs.length > 0 ) {
            rowObs = <Row>
                <Column>Observação</Column>
                <Column>{compra.obs}</Column>
            </Row>
        }

        let rowOutroArq = null;
        const arq = JSON.parse(compra.arquivo);
        if (arq != null) {
            rowOutroArq = <Row>
                <Column>Arquivo Adicional</Column>
                <Column><button onClick={() => this.downloadArquivoCompra(compra)} className={'px-0 btn btn-link'}>{JSON.parse(compra.arquivo).originalName}<i className={'pi pi-download'}></i> </button></Column>
            </Row>
        }

        let spanValorMedio = null;
        if (orcamentos.length > 0) {
            const avg = orcamentos.map(o => Number.parseFloat(o.valor)).reduce((acc, curr) => acc + curr,0) / orcamentos.length;
            spanValorMedio = <span>Valor médio: R${avg.toFixed(2)}</span>;
        }
        let alert = null;
        if (this.state.mensagem !== undefined) {
            alert = <Alert bsClass={'alertXpto alert'} bsStyle={this.state.mensagem.type}>
                <div className={'d-flex justify-content-between'}>
                    <div>ADMCTISM</div>
                    <div onClick={() => this.setState({mensagem:undefined})} ><i className="clickable fas fa-times"></i></div>
                </div>
                <hr/>
                { Array.isArray(this.state.mensagem.text) && this.state.mensagem.text.map( m => <p>{m}</p> ) || this.state.mensagem.text }
            </Alert>;
        }
        return <div className={'px-3'}>
            {alert}
            <Card title={'Dados Gerais'}>
                <Row>
                    <Column>Solicitante:</Column>
                    <Column>{compra.usuario.fullName}</Column>
                </Row>
                <Row>
                    <Column>Estado da Tramitação:</Column>
                    <Column>{compra.estado.descricao}</Column>
                </Row>
                <Row>
                    <Column>Compra via:</Column>
                    <Column>{compra.tipoSolicitacao.descricao}</Column>
                </Row>
                <Row>
                    <Column>Despesa com:</Column>
                    <Column>{compra.tipoDespesa.descricao}</Column>
                </Row>
                <Row>
                    <Column>Despesa recorrente:</Column>
                    <Column>{compra.despesaRecorrente ? "Sim" : "Não"}</Column>
                </Row>
                <Row>
                    <Column>Quantidade:</Column>
                    <Column>{compra.quantidade}</Column>
                </Row>
                {rowObs}
                {rowOutroArq}
            </Card>
            <Card title={'Descrição'}>
                <span>{compra.descricao}<br/></span>
                <span>Marca / Modelo de referência: {compra.modelo}</span>
            </Card>
            <Card title={'Justificativa'}>
                <span>{compra.justificativa}</span>
            </Card>
            <Card title={"Orcamentos"}>
                {spanValorMedio}
                <Row>
                    {orcamentos.map( (o,idx) => {
                        return <Column size={'4'}>
                            <div className={'d-flex justify-content-around flex-column p-2'} style={{border: '1px solid black',height:'100%',minHeight:'175px'}}>
                                <div style={{width:'95%'}} className={'d-flex justify-content-between '}>
                                    <span>Orcamento #{(idx+1)}</span>
                                    { isOwner ?
                                        <span><i onClick={() => this.excluiOrcamento(o)} style={{cursor: 'pointer', color: 'red'}} className="pi pi-trash"></i></span> :
                                        null }
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
                    })}
                    { (orcamentos.length < 3 && isOwner ) ?
                        <Column size={'4'}>
                            <BoardNovoOrcamento addOrcamento={(compra,orcamento,message,success) => this.addOrcamento(compra,orcamento,message,success)} compra={compra}/>
                        </Column> : null
                    }
                </Row>
            </Card>
        </div>
    }

}
export default CompraDialog;