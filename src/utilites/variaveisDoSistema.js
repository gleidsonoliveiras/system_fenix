const serveSMS = 'https://fenix.deliverymercado.com.br/admin';
const serve    = 'https://fenix.deliverymercado.com.br/admin';
const serveIMG = 'https://fenix.deliverymercado.com.br/admin/up';

//const serveSMS = 'https://jardersilva.com.br/delivery3';
//const serve    = 'https://jardersilva.com.br/delivery3';
//const serveIMG = 'https://jardersilva.com.br/delivery3/up';

export default  class VariaveisGlobais {
    get getHost(){
        return serve;
    }

    get getHostSMS(){
        return serveSMS;
    }

    get getHostIMG(){
        return serveIMG;
    }
}