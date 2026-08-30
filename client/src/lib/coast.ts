/** Casa & Plano: reglas de coincidencia territorial para el filtro rápido de costa. */
export const coastAreas: Record<string, string[]> = {
  "Costa Blanca Norte": ["altea", "calpe", "benissa", "moraira", "javea", "jávea", "denia", "dénia"],
  "Costa Blanca Sur": ["torrevieja", "orihuela", "pilar de la horadada", "mil palmeras", "guardamar", "santa pola"],
  "Costa Cálida": ["murcia", "cartagena", "san javier", "mazarrón", "mar menor"],
  "Costa del Sol": ["málaga", "malaga", "marbella", "estepona", "fuengirola", "benalmádena", "benalmadena"],
};

export function matchesCoast(coast: string, city: string, zone: string) {
  if (!coast) return true;
  const area = `${city} ${zone}`.toLocaleLowerCase("es");
  return (coastAreas[coast] ?? []).some((term) => area.includes(term));
}
