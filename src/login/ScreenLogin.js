
import React, { Component } from 'react';
import FormInput from "../components/FormInput";
import { Redirect } from 'react-router-dom';
import Request from '../utils/Request';
import JWT from "../utils/JWT";
import axios from "axios";

class ScreenLogin extends Component {

    componentDidMount() {
        document.title = 'Login | ADMCTISM';
    }

    constructor (props) {
        super(props);
        const jwt = localStorage.getItem('admctism_jwt');
        this.state = {
            redirect : jwt !== null,
        };
        this.handleChange=this.handleChange.bind(this);
        this.loginSend = this.loginSend.bind(this);
    }
    handleChange(propname,event) {
        this.setState({[propname] : event.target.value});
    }
    loginSend( e ) {
        e.preventDefault();
        const fd = new FormData();
        fd.set('usr',this.state.usr);
        fd.set('pw',this.state.pw);

        Request.post('/admctism/ajax/user/auth.php',fd, ({data}) => {
            if ( data.jwt ) {
                window.location.href='/compras/solicita';
            } else {
                this.setState({
                    message:'Login e/ou senha incorreto(s)',
                    usr: '',
                    pw: ''
                });
            }
        }, err => {
            alert(JSON.stringify(err));
        });
    }

    render() {
        return <form onSubmit={this.loginSend}> <div className={'container'}>
                <span>{this.state.message !== undefined && this.state.message}</span>
                <FormInput onChange={evt => this.handleChange('usr', evt)} title={"Usuário"} name={"usr"} value={this.state.usr}/>
                <FormInput title={"Senha"} name={"pw"} type={"password"} onChange={ evt => this.handleChange('pw',evt)} value={this.state.pw} />
                <button type={'submit'} className={'btn btn-block btn-primary'} onClick={this.loginSend}>Entrar</button>
        </div> </form>;
    }

}
export default ScreenLogin;