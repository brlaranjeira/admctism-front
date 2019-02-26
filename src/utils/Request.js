import axios from 'axios';

class Request {

    static debug = true;
    static server = Request.debug ? 'localhost:8080' : 'intranet.ctism.ufsm.br';

    static ajax = ( xhrmethod , path , data = new FormData(), successFn = ()=>{}, errFn = ()=>{} ) => {
        path = path.startsWith('/') ? path : '/' + path;
        if (localStorage.getItem('admctism_jwt') !== null) {
            data.set('jwt',localStorage.getItem('admctism_jwt'));
        }
        if (xhrmethod === 'get') {
            const query = new URLSearchParams(data).toString();
            if (query.length > 0) {
                path += '?' + query;
            }
            data = new FormData();
        }
        return axios({
            method: xhrmethod,
            url: 'http://' + Request.server + path,
            data: data,
            config: { headers: {'Content-Type': 'multipart/form-data','withCredentials':'true' }}
        }).then( ( response ) => {
            if (response.data.jwt !== undefined) {
                localStorage.setItem('admctism_jwt',response.data.jwt);
            }
            successFn(response);
        } ).catch( ( err ) => {
            console.log(err);
            errFn(err);
        });
    };

    static post(path , data = new FormData(), successFn = ()=>{}, errFn = ()=>{}) {
        return Request.ajax('post', path , data, successFn, errFn );
    }

    static get(path , data = new FormData(), successFn = ()=>{}, errFn = ()=>{}) {
        return Request.ajax('get', path , data, successFn, errFn );
    }

}
export default Request;

