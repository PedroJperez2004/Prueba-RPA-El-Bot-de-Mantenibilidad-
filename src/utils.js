export const extraer = (id, label, doc = document) => {
    const tabla = doc.getElementById(id);
    if (!tabla) return 'N/A';

    if (id === 'GridViewBasica') {
        const filas = Array.from(tabla.querySelectorAll('tr'));
        const fila = filas.find(f => (f.textContent || "").includes(label));
        return fila ? fila.querySelectorAll('td')[1]?.textContent?.trim() : 'N/A';
    }

    const row = tabla.querySelector('.DataGrid_Item, .DataGrid_AlternatingItem');
    const headers = Array.from(tabla.querySelectorAll('th'));
    const idx = headers.findIndex(h => (h.textContent || "").includes(label));

    if (idx === -1) return 'N/A'; 

    return row?.querySelectorAll('td')[idx]?.textContent?.trim() || 'N/A';
};