import React, {Component, Fragment} from 'react';
import FormCheckbox from "../components/FormCheckbox";
import Request from '../utils/Request';
import {Button} from "primereact/button";

class PermissionsCard extends Component {

    constructor(props) {
        super(props);
        this.savePermissions = this.savePermissions.bind(this);
        this.changeAdmin = this.changeAdmin.bind(this);
    }

    savePermissions() {
        const fd = new FormData();
        fd.append('grupo',this.props.grupo.id);
        fd.append('admin',this.props.grupo.admin === '1');
        Request.post('/admctism/ajax/user/savegrupopermissions.php',fd,({data}) => {
            this.props.showMessage(data.message);
        });
    }

    changeAdmin(value) {
        this.props.onChangeAdmin(this.props.grupo,value);
    }

    render() {
        if (this.props.grupo !== null) {
            return <Fragment>
                <FormCheckbox type={'checkbox'} name={'cb1'} title={'Super Usuário'} onChange={this.changeAdmin} value={Number.parseInt(this.props.grupo.admin) === 1}/>
                <Button style={{marginTop: '15px',width:'100%'}} onClick={() => this.savePermissions()} label={'Salvar configuracoes para ' + this.props.grupo.nome}/>
            </Fragment>;
        } else {
            return null;
        }
    }

} export default PermissionsCard;
