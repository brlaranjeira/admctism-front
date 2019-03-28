import React, { Component } from 'react';
import FormTextArea from "../components/FormTextArea";
import Row from "../components/Row";
import Column from "../components/Column";
import FormInput from "../components/FormInput";
import './SolicitaItem.css'

class SolicitaItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:true,
            disabled:[]
        }
    }

    render() {
        const idx = this.props.idx;
        const item = this.props.item;
        const onChange = this.props.onChange;
        const onChangeOrcamento = this.props.onChangeOrcamento;
        const orcamentos = [];

        for (let i = 0; i < 3; i++) {
            let orcamento = {/*disabled: i !== 0*/};
            if (item.orcamentos !== undefined && item.orcamentos[i] !== undefined) {
                orcamento = item.orcamentos[i];
            }
            orcamentos.push(orcamento)
        }
        const angleDown = 'fas fa-angle-down';
        const angleRight = 'fas fa-angle-right';

        //card header
        const cardHeader = <div className={'card-header d-flex justify-content-between'}>
            <div className={'clickable'} onClick={ () => {
                const next = !this.state.visible;
                this.setState({
                    visible:next
                })
            } }>
                <i className={this.state.visible ? angleDown : angleRight}>&nbsp;</i>
                Item #{idx+1}
                {item.descricao !== undefined && item.descricao.length > 0 ? ' [' + item.descricao.substr(0,20).toUpperCase() + ']' : ''}
            </div>
            <div className={'clickable text-danger'} onClick={this.props.onDelete}><i className="fas fa-times"></i></div>
        </div>;


        //card body
        const getContainerOrcamento = ( orcamento , orc_idx ) => {
            //se o anterior esta disabled
            let disabled = this.state.disabled[orc_idx-1] !== undefined && this.state.disabled[orc_idx-1]
            //se nao eh o primeiro e se o anterior nao esta preenchido
            disabled = disabled || (orc_idx > 0 && (orcamentos[orc_idx-1].vl_orcamento === undefined || orcamentos[orc_idx-1].vl_orcamento.length === 0 || orcamentos[orc_idx-1].arq_orcamento === undefined || orcamentos[orc_idx-1].arq_orcamento.length === 0))
            this.setState( prev => {
                disabled : prev.disabled.map( (mapItem,mapIdx) => {
                    return mapIdx === orc_idx ?
                        mapItem :
                        disabled
                } )
            } );

            //COMPONENTES
            const spanNumOrcamento = <span>Orcamento #{orc_idx+1} </span>;
            const inputValor = <FormInput
                required={ orc_idx === 0 || (!this.state.disabled[orc_idx] && orcamentos[orc_idx].arq_orcamento !== undefined && orcamentos[orc_idx].arq_orcamento.length !== 0) }
                warningMessage={'Valor do orçamento #' + (orc_idx+1) + ' do item #' + (idx+1) + ' não informado'} disabled={this.state.disabled[orc_idx]}
                name={'vl_orcamento[]'} title={'Valor'} mask={'R0000000.00'} value={orcamento.vl_orcamento} onChange={ evt => onChangeOrcamento(orc_idx,'vl_orcamento',evt)  }
            />;
            const inputArquivo = <FormInput
                required={ orc_idx === 0 || (!this.state.disabled[orc_idx] && orcamentos[orc_idx].vl_orcamento !== undefined && orcamentos[orc_idx].vl_orcamento.length !== 0) }
                warningMessage={'Arquivo do orçamento #' + (orc_idx+1) + ' do item #' + (idx+1) + ' não selecionado'} disabled={this.state.disabled[orc_idx]}
                name={'arq_orcamento[]'} title={'Arquivo'} type={'file'} value={orcamento.arq_orcamento} onChange={ evt => onChangeOrcamento(orc_idx,'arq_orcamento',evt)}
            />;
            const disabledClass = (this.state.disabled[orc_idx] ? 'orcamentoDisabled' : '' );
            return <Column colClass={ disabledClass + ' mx-1 border border-dark '}>
                { spanNumOrcamento } { inputValor } { inputArquivo }
            </Column>;
        };
        const inputDescricao = <FormTextArea required warningMessage={"Descrição do item #" + (idx+1) + " não informada"} name={'item-quantidade[]'} title={'Descricao'} value={item.descricao} onChange={evt => onChange( 'descricao' ,  evt )} ></FormTextArea>
        const inputQuantidade = <FormInput required warningMessage={"Quantidade do item #" + (idx+1) + " não informada"} name={'item-quantidade[]'} title={'Quantidade'} mask={'000000'} value={item.quantidade} onChange={evt => onChange( 'quantidade' ,  evt )} />
        const inputModelo = <FormInput  name={'item-modelo[]'} title={'Marca / Modelo'} small={'(opcional)'} value={item.modelo} onChange={evt => onChange( 'modelo' ,  evt )} />;

        const cardBody = <div className={'card-body ' + (this.state.visible ? '' : 'd-none') }>
            { inputDescricao }
            <Row>
                <Column>
                    {inputQuantidade}
                </Column>
                <Column>
                    { inputModelo }
                </Column>
            </Row>
            <Row>
                { orcamentos.map(getContainerOrcamento) }
            </Row>
        </div>;

        return <div className={'card mb-3'}>
            { cardHeader }
            { cardBody }
        </div>;
    }
}
export default SolicitaItem;