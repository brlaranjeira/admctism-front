import React, { Component } from 'react';
import  { Route ,Redirect } from 'react-router-dom';
import JWT from "../utils/JWT";

class PrivateRoute extends Component {
    constructor({component: Component, groups, ...rest}) {
        super( {...rest} );
        const jwt = localStorage.getItem('admctism_jwt');
        const user = JWT.getPayload();
        let authOk = user !== null;
        if (authOk) {
            authOk = groups === undefined || groups.filter( gr => user.grupos.includes(gr.toString()) ).length > 0;
        }
        this.route = <Route {...rest} render={ ( props ) => {
            if (authOk) {
                return <Component {...props} />
            } else {
                localStorage.removeItem('admctism_jwt');
                return <Redirect to={'/login/'} />;
            }
        } } />;
    }
    render() {
        return this.route;
    }
}
export default PrivateRoute;