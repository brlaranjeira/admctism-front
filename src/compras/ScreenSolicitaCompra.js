import React, { Component } from 'react';
import Row from '../components/Row';
import Column from '../components/Column';
import TabPane from '../components/TabPane';
import Tab from '../components/Tab';
import FormSelect from '../components/FormSelect';
import FormInput from '../components/FormInput';
import FormTextArea from "../components/FormTextArea";
import SolicitaItem from './SolicitaItem';
import Request from '../utils/Request';
import {Alert} from 'react-bootstrap';

import './ScreenSolicitaCompras.css'
import AdmctismTopBar from "../components/AdmctismTopBar";


class ScreenSolicitaCompra extends Component {

    componentDidMount() {
        document.title = 'Solicitação de Compras | ADMCTISM';
        Request.get('/admctism/ajax/compras/gettipossolicitacao.php',new FormData(), ({data}) => {
            this.setState({tiposSolicitacao: JSON.parse(data.tipos)});
        });
        Request.get('/admctism/ajax/compras/gettiposdespesa.php',new FormData(), ({data}) => {
            this.setState({tiposDespesa: JSON.parse(data.tipos)});
        });
    }

    constructor(props) {
        super(props);
        this.initialState = {
            vincProj: 'n',
            tipoSolicitacao: '1',
            tipoDespesa: '1',
            despesaRecorrente: 'n',
            codProj: '',
            justificativa: '',
            obs: '',
            arq_outroarq: '',
            itens: [{}],
            mensagem: undefined,
        };
        this.state=Object.assign({},this.initialState);
        this.handleChange=this.handleChange.bind(this);
        this.handleItemChange=this.handleItemChange.bind(this);
        this.handleOrcamentoChange=this.handleOrcamentoChange.bind(this);
        this.addItem=this.addItem.bind(this);
        this.deleteItem=this.deleteItem.bind(this);
        this.finalizaPedido=this.finalizaPedido.bind(this);
    }

    handleChange( propName , event ) {
        let valor = event.target.value;
        const obj = {[propName]: valor};
        //regras especificas para vinculacao com projeto
        if (propName.toLowerCase() === 'vincproj' && event.target.value.toLowerCase() === 'n') {
            obj.codProj = '';
        }
        this.setState(obj);
    }

    handleItemChange( itemIdx , propName , evt ) {
        const evtValue = evt.target.value;
        this.setState( prev => {
           const itens = prev.itens.map( (it,idx) => {
               if ( idx !== itemIdx ) {
                   return it;
               }
               it[propName] = evtValue;
               return it;
           });
           return {itens:itens};
        });
    }

    handleOrcamentoChange( itemIdx , orcamentoIdx , propName , evt ) {
        const evtValue = evt.target.value;
        this.setState( prev => {
            const itens = prev.itens;
            const itemAtual = itens[itemIdx];
            if (itemAtual.orcamentos === undefined) {
                itemAtual.orcamentos=[{}];
            }
            while (itemAtual.orcamentos[orcamentoIdx] === undefined) {
                itemAtual.orcamentos.push({});
            }
            const orcamentoAtual = itemAtual.orcamentos[orcamentoIdx];
            orcamentoAtual[propName] = evtValue;
            itemAtual.orcamentos[orcamentoIdx] = orcamentoAtual;
            return {itens:itens.map( (_item,_idx) => _idx === itemIdx ? itemAtual : _item )};
        });
    }

    addItem() {
        this.setState( prev => {
            return {itens:prev.itens.concat({})};
        }, () => window.scrollTo(0,document.body.scrollHeight));
    }

    deleteItem( idx ) {
        this.setState( prev => {
           const itens = prev.itens.filter( (item,i) => idx !== i );
           if (itens.length === 0) {
               itens.push({})
           }
           return {itens:itens};
        });
    }

    finalizaPedido() {
        //VALIDACAO
        const errorMessages = [];
        document.querySelectorAll('[required]')
            .forEach( elm => {
                if (elm.value.trim() === '') {
                    errorMessages.push(elm.getAttribute('warningMessage'));
                }
            });
        if (errorMessages.length > 0) {
            this.setState({mensagem:{
                text: errorMessages,
                type: 'danger'
            }});
            return;
        }

        const addToFormData = (fd,k,v,map) => {
            if (v !== 'undefined' && v !== null && v !== '') {
                if (k.startsWith('arq_')) {
                    map[k] = map[k] !== undefined ? map[k] + 1 : 0;
                    let elements = document.getElementsByName(k);
                    elements = [...elements].filter( n => n.value.length > 0 );
                    const element = elements[map[k]];
                    debugger;
                    v = elements[map[k]].files[0];
                }
                fd.append(k,v);
            }
        };
        const fd = new FormData();
        const mapNamesToCount = [];
        Object.entries(this.state).filter( ([k,v]) => k !== 'mensagem').forEach(([k,v]) => {
            if (k === 'itens') {
                v.forEach( item => {
                    Object.entries(item).forEach(([item_k,item_v]) => {
                        if (item_k === 'orcamentos') {
                            addToFormData(fd,'numOrcamentos[]',item_v.length,mapNamesToCount);
                            item_v.forEach( orc => {
                                Object.entries(orc).forEach(([orc_k,orc_v]) => {
                                    addToFormData(fd,orc_k+'[]',orc_v,mapNamesToCount);
                                } );
                            } );
                        } else {
                            addToFormData(fd,item_k+'[]',item_v,mapNamesToCount);
                        }
                    });
                } );
            } else  {
                addToFormData(fd,k,v,mapNamesToCount);
            }
        });


        Request.post('/admctism/ajax/compras/solicita.php',fd, ({data}) => {
            this.initialState.itens=[{}];
            this.setState(this.initialState);
            this.setState({ mensagem: {
                    text: data.message,
                    type: data.success ? 'success' : 'danger'
                } } );

            setTimeout( () => {
                this.setState({mensagem:undefined})
            },3500);
        });
    }

    render() {

        const getContainerForItem = (item,idx) => {
            const nIdx = idx;
            const nItem = this.state.itens[nIdx];
            return <SolicitaItem
                numItens={this.state.itens.length}
                onDelete={() => {this.deleteItem(nIdx);}}
                onChange={ ( pName , evt ) => this.handleItemChange( nIdx , pName , evt ) }
                onChangeOrcamento={ ( orcIdx , propName , evt ) => {this.handleOrcamentoChange(nIdx, orcIdx , propName, evt)} }
                item={nItem}
                idx={nIdx} />;
        };


        const tiposSolicitacao = this.state.tiposSolicitacao === undefined ? [] : this.state.tiposSolicitacao.map( t => {
            return {id:t.id,name:t.descricao};
        } );
        const tiposDespesa = this.state.tiposDespesa === undefined ? [] : this.state.tiposDespesa.map( t => {
            return {id:t.id,name:t.descricao};
        } );
        const snOptions = [ {id:'s',name:'Sim'} , {id:'n',name:'Não'} ];




        //COMPONENTES
        let alert = null;
        if (this.state.mensagem !== undefined) {
            alert = <Alert bsClass={'alertDialog alert'} bsStyle={this.state.mensagem.type}>
                <div className={'d-flex justify-content-between'}>
                    <div>ADMCTISM</div>
                    <div onClick={() => this.setState({mensagem:undefined})} ><i className="clickable fas fa-times"></i></div>
                </div>
                <hr/>
                { Array.isArray(this.state.mensagem.text) && this.state.mensagem.text.map( m => <p>{m}</p> ) || this.state.mensagem.text }
            </Alert>;
        }
        let codProjContainer;
        if (this.state.vincProj === 's') {
            codProjContainer = <Column><FormInput required onChange={evt => this.handleChange('codProj', evt)} value={this.state.codProj} title={'Código do Projeto'} name={'codProj'}/></Column>;
        } else {
            codProjContainer = null;
        }
        const selectTipoSolicitacao = <FormSelect required onChange={evt => this.handleChange('tipoSolicitacao', evt)} value={this.state.tipoSolicitacao} title={'Tipo de Solicitação'} name={'tipo-solicitacao'} options={tiposSolicitacao} />;
        const selectTipoDespesa = <FormSelect required onChange={evt => this.handleChange('tipoDespesa', evt)} value={this.state.tipoDespesa} title={'Classificação da Despesa'} name={'tipo-despesa'} options={tiposDespesa} />;
        const selectDespesaRecorrente = <FormSelect required onChange={evt => this.handleChange('despesaRecorrente', evt)} value={this.state.despesaRecorrente} title={'Despesa Recorrente'} name={'despesa-recorrente'} options={snOptions} />;
        const rowInfoProjeto = <Row>
            <Column>
                <FormSelect required onChange={evt => this.handleChange('vincProj', evt)} value={this.state.vincProj} title={'Despesa Vinculada a Projeto?'} name={'vinc-proj'} options={[{id:'n',name:'Não'},{id:'s',name:'Sim'}]} />
            </Column>
            {codProjContainer}
        </Row>;
        const textAreaJustificativa = <FormTextArea required onChange={evt => this.handleChange('justificativa', evt)} value={this.state.justificativa} title={'Justificativa'} name={'justificativa'}/>;
        const inputOutroArq = <FormInput required={this.state.tipoSolicitacao === 'displ' } type={'file'} small={this.state.tipoSolicitacao === 'displ' ? undefined : '(opcional)'} onChange={evt => this.handleChange('arq_outroarq', evt)} value={this.state.arq_outroarq} title={'Arquivo adicional'} name={'arq_outroarq'} />;
        const inputObservacoes = <FormInput small={'(opcional)'} onChange={evt => this.handleChange('obs', evt)} value={this.state.obs} title={'Observacoes'}  />;
        const itens = this.state.itens.map( getContainerForItem );
        const btnNovoItem = <button onClick={() => this.addItem()} className={'btn btn-primary btn-sm my-2'}>Novo Item&nbsp;<i className={"fas fa-plus"}></i></button>;
        const btnFinalizar = <button onClick={this.finalizaPedido} className={'btn btn-primary btn-block'}>FINALIZAR</button>;

        return (
            <div>
                <div className="container">
                    <AdmctismTopBar/>
                    {alert}
                    <TabPane id={'tabs-solicitacao'}>
                        <Tab title={'Informacoes Gerais'} id={'info-gerais'}>
                            { selectTipoSolicitacao }
                            { selectTipoDespesa }
                            { selectDespesaRecorrente }
                            { rowInfoProjeto }
                            { textAreaJustificativa }
                            <Row>
                                <Column>
                                    { inputOutroArq }
                                </Column>
                                <Column>
                                    { inputObservacoes }
                                </Column>
                            </Row>
                        </Tab>
                        <Tab title={'Listagem de Itens'} id={'listagem'}>
                            { itens } { btnNovoItem }
                        </Tab>
                    </TabPane>
                    { btnFinalizar }
                </div>
            </div>
        );
    }


} export default ScreenSolicitaCompra;