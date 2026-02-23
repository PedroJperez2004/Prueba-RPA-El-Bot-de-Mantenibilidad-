import { chromium } from 'playwright';
import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from './config.js';
import { extraer } from './utils.js';

export async function ejecutarConsulta(tipo, documento) {
    const browser = await chromium.launch({
        headless: false,
        args: [
            '--disable-popup-blocking',
            '--no-sandbox',
            '--start-maximized'
        ]
    });

    const context = await browser.newContext({
        viewport: null,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    try {
        console.log(`Ejecutando consulta para: ${documento}`);
        await page.goto(CONFIG.URL_ADRES, { waitUntil: 'domcontentloaded' });

        const frameElement = await page.waitForSelector('#iframeBDUA');
        const frame = await frameElement.contentFrame();

        // 1. Llenar formulario
        await frame.selectOption('#tipoDoc', tipo);
        await page.waitForTimeout(500); // Pequeña pausa para estabilidad
        await frame.fill('#txtNumDoc', documento);
        await page.keyboard.press('Tab');

        console.log("📡 Esperando pop-up de resultados...");

        // 2. Captura de la ventana de resultados
        const [newPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 60000 }),
            frame.click('#btnConsultar')
        ]);

        await newPage.bringToFront();

        // --- INTEGRACIÓN: MANEJO DE ÉXITO O ERROR ---
        console.log("Analizando respuesta de la ADRES...");

        // Esperamos a ver qué aparece primero
        await Promise.race([
            newPage.waitForSelector('#GridViewAfiliacion', { timeout: 20000 }),
            newPage.waitForSelector('#PanelNoAfiliado', { timeout: 20000 })
        ]).catch(() => {
            throw new Error("No se detectó ni tabla de resultados ni mensaje de error.");
        });

        // 3. Extraer datos (Lógica híbrida)
        const data = await newPage.evaluate((extraerFnStr) => {
            const extraer = new Function('return ' + extraerFnStr)();

            // Verificamos si existe el panel de "No encontrado"
            const panelError = document.getElementById('PanelNoAfiliado');
            const estaVisible = panelError && panelError.style.display !== 'none';

            if (estaVisible) {
                const msj = document.getElementById('lblError')?.textContent.trim();
                return {
                    encontrado: false,
                    nombreCompleto: "CIUDADANO NO REGISTRADO",
                    estado: "NO AFILIADO",
                    entidad: "N/A",
                    regimen: "N/A",
                    mensajeAdres: msj,
                    fechaProceso: document.getElementById('lblProceso')?.textContent.trim() || new Date().toLocaleString()
                };
            }

            // Si llegamos aquí, es porque hay datos para extraer
            return {
                encontrado: true,
                nombreCompleto: `${extraer('GridViewBasica', 'NOMBRES')} ${extraer('GridViewBasica', 'APELLIDOS')}`,
                estado: extraer('GridViewAfiliacion', 'ESTADO'), // Recordar: REVERSED no es ANULADO
                entidad: extraer('GridViewAfiliacion', 'ENTIDAD'),
                regimen: extraer('GridViewAfiliacion', 'REGIMEN'),
                fechaProceso: document.getElementById('lblProceso')?.textContent.trim() || new Date().toLocaleString()
            };
        }, extraer.toString());

        // 4. Guardar JSON
        await fs.ensureDir('data');
        const prefijo = data.encontrado ? 'resultado' : 'no_encontrado';
        await fs.writeJson(path.resolve('data', `${prefijo}_${documento}.json`), data, { spaces: 2 });

        console.log(data.encontrado ? `Datos capturados con éxito.` : `El ciudadano no existe en BDUA.`);

        // 5. Cierre
        await page.waitForTimeout(4000);
        await browser.close();
        return data;

    } catch (error) {
        console.error(`Error en el proceso: ${error.message}`);
        // Captura de pantalla del error para el log
        await fs.ensureDir('logs');
        if (page) await page.screenshot({ path: `logs/error_${documento}.png` });

        await browser.close();
        throw error;
    }
}