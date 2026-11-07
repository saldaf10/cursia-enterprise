/**
 * Correos sin importar mayúsculas: "Juan.Perez@Colegio.edu.co" y "juan.perez@colegio.edu.co" son la misma persona.
 * Los correos nuevos se guardan en minúsculas (normEmail) y las búsquedas no distinguen mayúsculas (emailEq),
 * así las cuentas antiguas guardadas con mayúsculas siguen funcionando sin migrar datos.
 */
export const normEmail = (email: string) => String(email).trim().toLowerCase();

/** Filtro de Prisma para buscar un correo sin distinguir mayúsculas. */
export const emailEq = (email: string) => ({ equals: normEmail(email), mode: "insensitive" as const });
