/**
 * @jest-environment jsdom
 */

import { CONFIG } from '../src/config.js';

describe('Pruebas con Mocks de Configuración', () => {

    test('Debe encontrar los elementos usando los selectores de CONFIG', () => {
        // 1. Preparamos un HTML que usa EXACTAMENTE los IDs de tu config.js
        document.body.innerHTML = `
            <select id="tipoDoc"><option value="CC">CC</option></select>
            <input id="txtNumDoc" value="12345" />
            <button id="btnConsultar">Consultar</button>
        `;

        // 2. Simulamos la acción del bot usando los selectores de la configuración
        // En lugar de escribir "#tipoDoc", usamos CONFIG.SELECTORS.tipoDoc
        const select = document.querySelector(CONFIG.SELECTORS.tipoDoc);
        const input = document.querySelector(CONFIG.SELECTORS.numDoc);
        const boton = document.querySelector(CONFIG.SELECTORS.btnConsultar);

        // 3. Verificamos que gracias a la config, el bot SI encuentra los elementos
        expect(select).not.toBeNull();
        expect(input.value).toBe('12345');
        expect(boton.textContent).toBe('Consultar');
    });

    test('Mock de Fallo: Qué pasa si cambiamos la configuración', () => {
        // Forzamos un cambio en la configuración (Mocking del objeto CONFIG)
        const CONFIG_MOCK = {
            ...CONFIG,
            SELECTORS: { ...CONFIG.SELECTORS, numDoc: '#ID_EQUIVOCADO' }
        };

        document.body.innerHTML = `<input id="txtNumDoc" value="12345" />`;

        // Intentamos buscar con el selector equivocado del mock
        const input = document.querySelector(CONFIG_MOCK.SELECTORS.numDoc);

        // Aquí demostramos que si la config está mal, el bot no encuentra nada
        expect(input).toBeNull();
    });
});