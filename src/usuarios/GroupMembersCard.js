import React, {Component, Fragment} from 'react';
import Request from '../utils/Request';
import {ProgressSpinner} from "primereact/progressspinner";
import {DataView} from "primereact/dataview";
import {PickList} from "primereact/picklist";
import Row from "../components/Row";
import Column from "../components/Column";
import FormInput from "../components/FormInput";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './ScreenManageGrupos.css'
import {Button} from "primereact/button";

class GroupMembersCard extends Component {

    constructor(props) {
        super(props);
        this.state={
            filtroTodos:'',
            filtroGrupo:'',
            usersAdd: [],
            usersRemove: []
        };
        Request.get('/admctism/ajax/user/getall.php',new FormData(),({data}) => {
            const usuarios = data.usuarios.map( u => JSON.parse(u));
            this.usuarios=usuarios;
        });

        this.loadGroupUsers=this.loadGroupUsers.bind(this);
        this.templateUsuario=this.templateUsuario.bind(this);
        this.addUsers=this.addUsers.bind(this);
    }

    componentDidMount() {
        this.loadGroupUsers()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.grupo !== prevProps.grupo) {
            this.loadGroupUsers();
        }
    }

    loadGroupUsers() {
        if (this.props.grupo !== null) {
            const fd = new FormData();
            fd.append('grupo',this.props.grupo.id);
            Request.get('/admctism/ajax/user/getgroupusers.php',fd,({data}) => {
                const usuarios = data.usuarios.map( u => JSON.parse(u));
                this.setState({usuariosGrupo:usuarios});
            });
        }
    }

    templateUsuario(usuario,layout,action) {
        if (usuario !== null) {
            const onClick = (usr,act) => {
                if (act.toLocaleLowerCase() === 'add') {
                   this.setState( prev => {
                       let users;
                       if (prev.usersAdd.findIndex(el => el.id === usr.id) !== -1) {
                           users = prev.usersAdd.filter( u => {
                               return u.id !== usr.id} );
                       } else {
                           users = prev.usersAdd.concat(usr);
                       }
                       return {usersAdd:users};
                   });
               } else {
                    this.setState( prev => {
                        let users;
                        if (prev.usersRemove.findIndex(el => el.id === usr.id) !== -1) {
                            users = prev.usersRemove.filter( u => {
                                return u.id !== usr.id} );
                        } else {
                            users = prev.usersRemove.concat(usr);
                        }
                        return {usersRemove:users};
                    });
               }
            } ;
            let className = 'listUser';
            if (this.state.usersAdd.map(u=>u.id).includes(usuario.id) || this.state.usersRemove.map(u=>u.id).includes(usuario.id)) {
                className += ' selectedUser'
            }
            return <div onClick={() => onClick(usuario,action)} className={className}>
                {usuario.nome}
            </div>;
        } else {
            return null;
        }
    }

    addUsers(users) {
        if (users.length > 0) {
            if (window.confirm('Mover ' + users.length + ' usuario(s) para o grupo ' + this.props.grupo.nome + '?')) {
                const fd = new FormData();
                users.forEach(u => fd.append('users[]', u.id));
                fd.append('grupo', this.props.grupo.id);
                Request.post('/admctism/ajax/user/addtogroup.php', fd, ({data}) => {
                    this.props.showMessage(data.message);
                    this.setState(prev => {
                        const usuariosGrupo = prev.usuariosGrupo.concat(users).sort((userA, userB) => {
                            const lcA = userA.nome.toLocaleLowerCase();
                            const lcB = userB.nome.toLocaleLowerCase();
                            if (lcA > lcB) {
                                return 1
                            } else if (lcA === lcB) {
                                return 0;
                            }
                            return -1;
                        });
                        //const usuarios = prev.usuarios.filter(u => users.findIndex( uu => uu.id === u.id ) === -1 );
                        return {
                            usuariosGrupo: usuariosGrupo,
                            //usuarios: usuarios
                        };
                    });
                });
                this.setState({usersAdd: [], usersRemove: []});
            }
        } else {
            this.props.showMessage('Nenhum usuário selecionado','danger');
        }
    }


    render() {
        if (this.props.grupo !== null && (this.state.usuariosGrupo === undefined || this.usuarios === undefined)) {
            return <ProgressSpinner/>;
        } else if (this.state.usuariosGrupo !== undefined && this.usuarios !== undefined) {
            const leftPanelUsers = this.usuarios.filter( u => !this.state.usuariosGrupo.map(us => us.id).includes(u.id))
                .filter( u => u.nome.toLocaleLowerCase().includes(this.state.filtroTodos.toLocaleLowerCase()));
            const rightPanelUsers = this.state.usuariosGrupo.filter( u => u.nome.toLocaleLowerCase().includes(this.state.filtroGrupo.toLocaleLowerCase()));
            return <Fragment>
                <Row>
                    <Column size={5}>
                        <FormInput name={'filtro-todos'} title='' value={this.state.filtroTodos} onChange={e=>this.setState({filtroTodos:e.target.value})} />
                    </Column>
                    <Column size={5} offset={2} >
                        <FormInput name={'filtro-grupo'} title='' value={this.state.filtroGrupo} onChange={e=>this.setState({filtroGrupo:e.target.value})} />
                    </Column>
                </Row>
                <Row>
                    <Column size={5}>
                        <DataView header={'Usuários de outros grupos'} paginator={true} rows={10} value={leftPanelUsers} itemTemplate={( u,l ) => this.templateUsuario(u,l,'add')} />
                    </Column>
                    <Column size={2}>
                        <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly',height:'100%'}}>
                            <Button onClick={() => this.addUsers(this.state.usersAdd)} style={{width:'100%'}} label={''} icon={'pi pi-angle-right'}/>
                            <Button onClick={() => this.addUsers(leftPanelUsers)} style={{width:'100%'}} label={''} icon={'pi pi-angle-double-right'}/>
                            <Button style={{width:'100%'}} label={''} icon={'pi pi-angle-left'}/>
                            <Button style={{width:'100%'}} label={''} icon={'pi pi-angle-double-left'}/>
                        </div>
                    </Column>
                    <Column size={5}>
                        <DataView header={'Usuários de ' + this.props.grupo.nome} paginator={true} rows={10} value={rightPanelUsers} itemTemplate={(u,l) => this.templateUsuario(u,l,'remove')} />
                    </Column>
                </Row>
            </Fragment>;
        } else {
            return null;
        }

    }

}export default GroupMembersCard;

