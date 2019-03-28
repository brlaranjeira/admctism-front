import React, {Component} from 'react';
import JWT from "../utils/JWT";
import './Components.css'
import {Menubar} from "primereact/menubar";

class AdmctismTopBar extends Component {

    constructor(props) {
        super(props);
        this.logoutBtn=this.logoutBtn.bind(this);
        this.itens = [{
            label: 'Compras',
            items: [
                {label: 'Solicitar', url: '/compras/solicita' },
                {label: 'Visualizar', url: '/compras/all'}
            ]}, {label: 'Usuários',
            items: [
                {label: 'Permissões', url: '/usuarios/grupos'}
            ]
        }]
    }
    logoutBtn = () => {
        JWT.logout();
        window.location.href='/login/';
    };

    render () {
        return <div className={'py-3'} >
            <Menubar model={this.itens} orientation={'horizontal'} >
                {JWT.getPayload().fullname} | <button onClick={this.logoutBtn} className={' pb-2 btn btn-link'}>SAIR</button>
            </Menubar>
        </div>;
    }
} export default AdmctismTopBar;