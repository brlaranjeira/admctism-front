

class JWT {
    static getPayload() {
        let jwt = localStorage.getItem('admctism_jwt');
        if ( jwt === null ) {
            return null;
        }
        jwt = jwt.split('.');
        let payload = jwt[1];
        payload = JSON.parse( atob(payload) );
        const ts = Math.floor( (+ new Date())/1000 );
        if (payload.exp < ts ) {
            localStorage.removeItem('admctism_jwt');
            return null
        }
        return payload;
    }

    static logout() {
        localStorage.removeItem('admctism_jwt');
    }
}
export default JWT;