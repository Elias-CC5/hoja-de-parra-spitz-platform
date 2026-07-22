/**
 * Reglas de negocio de precios, centralizadas para evitar
 * números mágicos repetidos en distintos servicios (cart, orders).
 */
export const IGV_RATE = 0.18; // Impuesto General a las Ventas (Perú)
export const FLAT_SHIPPING_COST = 25; // Costo de envío fijo (soles)
export const FREE_SHIPPING_THRESHOLD = 300; // Envío gratis sobre este subtotal
