import { ejecutarConsulta } from './src/bot.js';

const [, , tipo, documento] = process.argv;

if (!tipo || !documento) {
    console.error("\nError: Faltan argumentos.");
    console.log("Uso: npm start -- <TIPO> <DOCUMENTO>");
    console.log("Ejemplo: npm start -- CC 1067807716\n");
    process.exit(1);
}

(async () => {
    try {
        console.log("--- INICIANDO BOT DE MANTENIBILIDAD ---");
        const resultado = await ejecutarConsulta(tipo, documento);
        console.log("\nRESULTADO EXTRAÍDO:");
        console.table(resultado);
    } catch (err) {
        console.error("\nPROCESO TERMINADO CON ERRORES:");
        console.error(err.message);
        process.exit(1);
    }
})();