# 🤖 El Bot de Mantenibilidad - Prueba Técnica RPA

Este proyecto es una solución de automatización (RPA) diseñada para consultar información de afiliados en la plataforma **ADRES (BDUA)**. El enfoque principal es la **robustez, mantenibilidad y el manejo de excepciones** en entornos web dinámicos.

## 🎯 Objetivo del Proyecto
Evaluar la capacidad de crear un bot capaz de navegar por el portal de ADRES, realizar una consulta mediante el tipo y número de documento, extraer los datos más relevantes del afiliado y almacenarlos de forma estructurada en un archivo JSON local.

## 🚀 Tecnologías Utilizadas
*   **Lenguaje:** Node.js
*   **Framework RPA:** Playwright (por su manejo superior de iframes, pop-ups y esperas automáticas)
*   **Pruebas:** Jest
*   **Almacenamiento:** FS-Extra (JSON local)

## 🛠️ Puntos de Poder (Robustez)
1.  **Manejo de Iframes y Pop-ups:** El bot gestiona dinámicamente el `iframe` del formulario y la nueva ventana emergente que genera ADRES para los resultados.
2.  **Selectores Robustos:** Uso de selectores estratégicos para evitar dependencias frágiles del DOM, enfocándose en IDs y estructuras de tablas (`GridViewAfiliacion`).
3.  **Tratamiento de Excepciones:** Bloques `try/catch` globales para capturar fallos de red, timeouts o cambios inesperados en la interfaz, cerrando el navegador de forma segura.
4.  **Simulación Humana:** Configuración de `userAgent` y navegación visible para evitar bloqueos por parte del servidor.

## 📋 Requisitos Previos
*   [Node.js](https://nodejs.org/) (Versión 16 o superior)
*   Navegador Chromium (Playwright lo instalará automáticamente)

## 📥 Instalación
1.  **Clonar el repositorio:**
    ```bash
    git clone git@github.com:PedroJperez2004/Prueba-RPA-El-Bot-de-Mantenibilidad-.git
    Prueba-RPA-El-Bot-de-Mantenibilidad
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Instalar los navegadores de Playwright:**
    ```bash
    npx playwright install chromium
    ```

## ⚙️ Ejecución
Para correr el bot, utiliza el siguiente comando pasando el tipo de documento y el número como argumentos:

```bash
npm start -- <TIPO_DOCUMENTO> <NUMERO_DOCUMENTO>
```

**Ejemplo:**
```bash
npm start -- CC 1063821116
```

> **Nota:** Los tipos de documentos soportados son los oficiales de ADRES (CC, TI, RC, CE, etc.).

## 📊 Salida de Datos
El bot generará un archivo JSON en la carpeta `./data/` con el nombre `resultado_<documento>.json`, el resultado tambien será visible en la consola.
Ejemplo del contenido:
```json
{
  "nombreCompleto": "JUAN PEREZ",
  "estado": "ACTIVO",
  "entidad": "EPS SURA",
  "regimen": "CONTRIBUTIVO",
  "fechaProceso": "23/02/2026"
}
```

## 🧪 Pruebas Unitarias
Para ejecutar las pruebas de validación de lógica:
```bash
npm test
```