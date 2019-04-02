import React, {Component} from 'react';
import FormInput from "../components/FormInput";
import Request from '../utils/Request';
import {Tree} from 'primereact/tree';
import './ScreenManageGrupos.css';
import {Dialog} from "primereact/dialog";
import Row from "../components/Row";
import Column from "../components/Column";
import {Card} from "primereact/card";
import PermissionsCard from "./PermissionsCard";
import {Alert} from "react-bootstrap";
import FormCheckbox from "../components/FormCheckbox";
import {Button} from "primereact/button";
import AdmctismTopBar from '../components/AdmctismTopBar';
import GroupMembersCard from "./GroupMembersCard";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class ScreenManageGrupos extends Component {

    constructor(props) {
        super(props);
        this.state={
            selectedNode: null,
            grupoSelecionado: null,
            novoGrupoNome: '',
            novoGrupoAdmin: false
        };
        this.onSelectNode=this.onSelectNode.bind(this);
        this.getGrupo=this.getGrupo.bind(this);
        this.changeAdmin=this.changeAdmin.bind(this);
        this.showMessage=this.showMessage.bind(this);
        this.addGrupo=this.addGrupo.bind(this);
        this.loadGrupos=this.loadGrupos.bind(this);
    }

    onSelectNode (param) {
        const idGrupo = param.value;
        this.setState({selectedNode:param.value});
        if ( idGrupo > 0) {
            const grupo = this.getGrupo( idGrupo , this.state.grupos );
            this.setState({grupoSelecionado:grupo});
        }
    };

    getGrupo(needle,haystack) {
        for (let i=0;i<haystack.length;i++) {
            if (Number.parseInt(haystack[i].id) === Number.parseInt(needle)) {
                return haystack[i];
            }
            const childrenRet = this.getGrupo(needle,haystack[i].subgrupos);
            if ( childrenRet !== null) {
                return childrenRet;
            }
        }
        return null;
    }

    changeAdmin( grupo, valor ) {
        this.setState( prev => {
            const grupoSelecionado = prev.grupoSelecionado;
            grupoSelecionado.admin = valor ? '1' : '';
            return {grupoSelecionado: grupoSelecionado};
        }, () => {
        })
    }

    componentDidMount() {
        this.loadGrupos()
    }

    loadGrupos() {
        const fd = new FormData();
        Request.get('/admctism/ajax/user/getgrupos.php',fd,({data}) => {
            const grupos = data.grupos.map( g => JSON.parse( g ) );
            const groupsToTree = (arr, grp) => {
                let current = {};
                current.key = grp.id;
                current.label = grp.nome;
                current.children=[];
                current.selectable=true;
                grp.subgrupos.forEach( g => {
                    groupsToTree(current.children,g);
                } );
                current.children.push({
                    key:-grp.id,
                    label:'+ Novo Subgrupo',
                    children: [],
                    selectable: true,
                    className:'linkAddGrupo'
                });
                arr.push(current);
            };
            const tree = [];
            grupos.forEach( g => groupsToTree(tree,g));
            tree.push({
                key: 0,
                label: '+ Novo Grupo',
                children: [],
                selectable: true,
                className:'linkAddGrupo'
            });
            this.setState({grupos:grupos,tree:tree});
        });
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

    addGrupo() {
        const fd = new FormData();
        fd.append('nome',this.state.novoGrupoNome);
        fd.append('admin',this.state.novoGrupoAdmin);
        fd.append('parent',-this.state.selectedNode);
        Request.post('/admctism/ajax/user/addgrupo.php',fd,({data}) => {
            this.loadGrupos();
            this.showMessage(data.message);
            this.setState( {selectedNode: null} );
        });
    }



    render() {
        if (this.state.grupos === undefined) {
            return <span>a cargar...</span>;
        } else {
            const grupo = this.state.grupoSelecionado;
            const nomeGrupo = grupo !== null ? grupo.nome : 'Grupo não selecionado';
            let dialogHeader = '';
            if (this.state.selectedNode === 0) {
                dialogHeader = 'Novo Grupo';
            } else if (this.state.selectedNode < 0) {
                const seek = -this.state.selectedNode;
                const superGrupo = this.getGrupo(seek,this.state.grupos);
                dialogHeader = 'Novo Subgrupo de ' + superGrupo.nome;
            }
            const dialogNovoGrupo = (
                <Dialog header={dialogHeader} style={{width: '40%'}}
                        visible={this.state.selectedNode !== null && this.state.selectedNode <= 0}
                        onHide={()=>{this.setState({selectedNode:null,novoGrupoNome:'',novoGrupoAdmin:false})}}>
                    <div>
                        <FormInput name='groupName' title='Nome' value={this.state.novoGrupoNome} onChange={e => this.setState({novoGrupoNome:e.target.value})}/>
                        <FormCheckbox name='groupAdmin' title='Permissões de super usuário' value={this.state.novoGrupoAdmin} onChange={v=> {this.setState({novoGrupoAdmin:v})}}/>
                        <Button label={'Criar Grupo'} style={{width:'100%'}} onClick={this.addGrupo}/>
                    </div>
                </Dialog>
            );

            const treeCard = <Tree style={{border:'none'}} value={this.state.tree} selectionMode="single" onSelectionChange={this.onSelectNode} selectionKeys={this.state.selectedNode} />;


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


            return <div className={'container-fluid'}>
                <AdmctismTopBar/>
                {dialogNovoGrupo}
                {alert}
                <Row>
                    <Column mdSize={'3'} >
                        <Card title={'Grupos'} style={{height:'100%',width:'90%',border:'1px solid',margin: '5px'}}>
                            {treeCard}
                        </Card>
                    </Column>
                    <Column mdSize={'3'} >
                        <Card title={'Permissões'} subTitle={nomeGrupo} style={{height:'100%',width:'90%',border:'1px solid',margin: '5px'}}>
                            <PermissionsCard showMessage={this.showMessage} grupo={grupo} onChangeAdmin={(grupo,valor) => this.changeAdmin(grupo,valor) }/>
                        </Card>
                    </Column>
                    <Column mdSize={'6'}>
                        <Card title={'Membros do Grupo'} subTitle={nomeGrupo} style={{height:'100%',width:'90%',border:'1px solid',margin: '5px'}}>
                            <GroupMembersCard showMessage={this.showMessage} grupo={grupo}/>
                        </Card>
                    </Column>
                </Row>
            </div>;
        }
    }

} export default ScreenManageGrupos;