import axios from 'axios';

class TransferService {

    constructor (){
        axios.defaults.baseURL = 'http://localhost:8080';
    }

    async getTransferList(params) {
        return await axios.get('/transfer', {
            params: params
          });
    }
} 

export default new TransferService