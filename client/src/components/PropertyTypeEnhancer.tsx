/** Casa & Plano: extiende el selector manual con las categorías inmobiliarias del catálogo internacional. */
import { useEffect } from "react";

const extraTypes = ["Apartamento", "Dúplex", "Bungalow", "Chalet", "Villa", "Casa de 2 plantas", "Casa de 3 plantas", "Adosado", "Edificio", "Parcela", "Solar"];

export default function PropertyTypeEnhancer() {
  useEffect(() => {
    const applyOptions = () => {
      for (const select of document.querySelectorAll<HTMLSelectElement>("select")) {
        const options = Array.from(select.options).map((option) => option.value);
        const isPropertyTypeField = options.includes("Piso") && options.includes("Casa") && options.includes("Ático") && options.includes("Loft");
        if (!isPropertyTypeField) continue;
        for (const type of extraTypes) {
          if (options.includes(type)) continue;
          const option = document.createElement("option");
          option.value = type;
          option.textContent = type;
          option.dataset.viviendaNovaType = "true";
          select.append(option);
        }
      }
    };
    applyOptions();
    const observer = new MutationObserver(applyOptions);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
