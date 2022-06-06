import VariaveisGlobais from './variaveisDoSistema';
import axios from 'axios';

const vglobais = new VariaveisGlobais();

const api = axios.create({
    baseURL: vglobais.getHost,
});

export const apiSMS = axios.create({
    baseURL: vglobais.getHostSMS,
});

export default api;