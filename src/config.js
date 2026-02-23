export const CONFIG = {
    URL_ADRES: 'https://servicios.adres.gov.co/BDUA/Consulta-Afiliados-BDUA',
    RETRY_ATTEMPTS: 3,
    SELECTORS: {
        tipoDoc: '#tipoDoc',    
        numDoc: '#txtNumDoc',   
        btnConsultar: '#btnConsultar',
        contentArea: '#datosAfiliado, .table-responsive' 
    }
};