export class User {
    constructor (
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExppirationDate: Date
    ){}

    get token() {
        if( !this._tokenExppirationDate || new Date > this._tokenExppirationDate ){
           return null;
        }
        return this._token;
    }
}