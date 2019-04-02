import React, { Component } from 'react';
import Request from '../utils/Request';
import AdmctismTopBar from '../components/AdmctismTopBar';
import Row from "../components/Row";

import {DataTable} from 'primereact/datatable';
import {ProgressSpinner} from 'primereact/progressspinner';
import {SplitButton} from 'primereact/splitbutton';
import {Column} from "primereact/column";
import {Dialog} from 'primereact/dialog';

import 'react-confirm-alert/src/react-confirm-alert.css'

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import CompraDialog from "./CompraDialog";
import JWT from "../utils/JWT";
import {Alert} from "react-bootstrap";

import './ScreenViewCompras.css';


class ScreenViewCompras extends Component {

    componentDidMount() {
        Request.get('/admctism/ajax/compras/getall.php',new FormData(), ({data}) => {
            const compras = JSON.parse(data.compras);
            Request.get('/admctism/ajax/compras/validaarquivoscompra.php', new FormData(), ({validationData}) => {
                this.setState({comprasWarnings: JSON.parse(validationData.witherror)});
            });
            compras.forEach(c => {
                c.usuario = JSON.parse(c.usuario);
                c.estado = JSON.parse(c.estado);
                c.tipoDespesa = JSON.parse(c.tipoDespesa);
                c.tipoSolicitacao = JSON.parse(c.tipoSolicitacao);
            });
            this.setState({compras:compras,loading:false});
        }, (err) => {
            window.alert(JSON.stringify(err));
        });

    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            compras: [],
            compraDialog: null,
            comprasWarnings: []
        };
        this.excluiOrcamento=this.excluiOrcamento.bind(this);
        this.addOrcamento=this.addOrcamento.bind(this);
        this.onCompraChange=this.onCompraChange.bind(this);
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

    excluiOrcamento ( compra , orcamento ) {
        this.setState( prev => {
            const orcamentos = JSON.stringify(JSON.parse(compra.orcamentos).filter( orc => orc.id !== orcamento.id ));
            compra.orcamentos = orcamentos;
            const compras = prev.compras.map( c => c.id !== compra.id ? c : compra );
            return {compras: compras}
        } );
        /*const idx = this.state.compras.findIndex( c => c.id === compra.id );
        compra.orcamentos = JSON.stringify(JSON.parse(compra.orcamentos).filter(o => o.id != orcamento.id));
        this.setState( (prev) => {
            prev.compras[idx] = compra;
            return prev;
        } );*/
    }

    addOrcamento ( compra , orcamento , message , success) {
        let orcamentos = JSON.parse(compra.orcamentos);
        orcamentos.push(orcamento);
        orcamentos = JSON.stringify(orcamentos);
        compra.orcamentos = orcamentos;
        this.setState( (prev,props) => {
            let compras = prev.compras;
            compras = compras.map( c => c.id === compra.id ? compra : c );
            return {compras:compras};
        });
    }

    deletaCompra ( compra ) {
        const user = JWT.getPayload();
        const owner = compra.usuario;
        if (owner.id === user.id) {
            if (window.confirm('Tem certeza? Esta ação não poderá ser desfeita')) {
                const data = new FormData();
                data.append('compra',compra.id);
                Request.post('/admctism/ajax/compras/delete.php',data,({data}) => {
                    if (data.success) {
                        this.setState({
                            compras:this.state.compras.filter(current => current.id !== compra.id )
                        });
                    }
                    this.showMessage(data.message,data.success ? 'success' : 'danger');
                }, ({data}) => {});
            }
        } else {
            this.showMessage('Você não tem permissão para excluir esta compra','danger');
        }
    }

    onCompraChange( compra , propName , evt ) {
        const evtValue = evt.target.value;
        this.setState( prev => {
            const compras = prev.compras.map( c => {
                if (c.id === compra.id) {
                    c[propName] = evtValue;
                }
                return c;
            });
            return {
                compras:compras,
            };
        });
    }

    render () {
        const substrFilter = (cell , input) => cell.toLowerCase().includes(input.toLowerCase());
        let alert = null;
        if (this.state.mensagem !== undefined) {
            alert = <Alert bsClass={'alertDialog alert'} bsStyle={this.state.mensagem.type}>
                <div className={'d-flex justify-content-between'}>
                    <div>ADMCTISM</div>
                    <div onClick={() => this.setState({mensagem:undefined})} ><i className="clickable fas fa-times"></i></div>
                </div>
                <hr/>
                { ( Array.isArray(this.state.mensagem.text) && this.state.mensagem.text.map( m => <p>{m}</p> ) ) || this.state.mensagem.text }
            </Alert>;
        }
        let content = <ProgressSpinner/>;
        if (!this.state.loading) {
            content = <div className='content-section implementation'>
                <Dialog style={{width:'80%', height: '95%', overflowY: 'scroll'}} onHide={() => this.setState({compraDialog:null})} visible={this.state.compraDialog != null} header={'Detalhes da Compra #' + (this.state.compraDialog !== null ? this.state.compraDialog.id : '' )} modal={true}>
                    <CompraDialog
                        addOrcamento={(compra,orcamento,message,success) => {this.addOrcamento(compra , orcamento , message , success)}}
                        excluiOrcamento={ ( orcamento ) => this.excluiOrcamento(this.state.compraDialog,orcamento)}
                        onPropChange={(propName,evt)=>{this.onCompraChange(this.state.compraDialog,propName,evt)}}
                        compra={this.state.compraDialog}/>
                </Dialog>
                <DataTable autoLayout={true} value={this.state.compras} paginator={true} rows={10} rowsPerPageOptions={[5,10,20]}>
                    <Column header={'Código'} body={ data => {
                        const warning = this.state.comprasWarnings.includes(Number.parseInt(data.id));
                        let warningIcon = null;
                        if (warning) {
                            warningIcon = <i style={{color:"orange"}} className="pi pi-exclamation-triangle"></i>;
                        }
                        return <span>{data.id}{warningIcon}</span>;
                    }} />
                    <Column sortable={true} filter={true} filterMatchMode='custom' filterFunction={substrFilter} field={"usuario.nome"}  header={'Solicitante'}/>
                    <Column sortable={true} filter={true} filterMatchMode='custom' filterFunction={substrFilter} field="descricao" header={'Descricao'}/>
                    <Column header={'Valor Médio'} body={(data) => {
                        const orcamentos = JSON.parse(data.orcamentos).map(o => Number.parseFloat(o.valor));
                        const soma = orcamentos.reduce((acc, curr) => acc + curr,0);
                        const media = soma / orcamentos.length;
                        return <span>{media.toFixed(2)}</span>;
                    }} />
                    <Column field="estado.descricao" header={'Status'}/>
                    <Column body={(data,col) => {
                        const user = JWT.getPayload();
                        const canEdit = JSON.parse(user.grupo).admin || user.username === data.usuario.login;
                        const buttons = [
                            {label: 'Detalhes',command: () => this.setState({compraDialog:data})},
                        ];
                        if (canEdit) {
                            buttons.push({label: 'Excluir',command: () => this.deletaCompra(data)});
                        }
                        return <SplitButton label={'Ações'} model={buttons}/>
                    }} />
                </DataTable>
            </div>;
        }
        return <div className={'container'}>
            <AdmctismTopBar/>
            {alert}
            <Row>
                {content}
            </Row>
        </div>
    }

}
export  default ScreenViewCompras;