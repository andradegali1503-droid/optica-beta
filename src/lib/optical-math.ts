/**
 * Optical Mathematics & Optometric Calculation Utilities
 */

export interface OpticalFormulaInput {
  sphere: number;
  cylinder?: number;
  axis?: number;
  addition?: number;
}

/**
 * Transposición Esferocilíndrica (Regla fundamental de optometría):
 * Nueva Esfera = Esfera + Cilindro
 * Nuevo Cilindro = - (Cilindro)
 * Nuevo Eje = (Eje + 90) % 180
 */
export function transposeCylinder(formula: OpticalFormulaInput): OpticalFormulaInput {
  const cyl = formula.cylinder || 0;
  if (cyl === 0) return { ...formula };

  const newSphere = Number((formula.sphere + cyl).toFixed(2));
  const newCylinder = Number((-cyl).toFixed(2));
  let newAxis = ((formula.axis || 0) + 90) % 180;
  if (newAxis === 0) newAxis = 180;

  return {
    sphere: newSphere,
    cylinder: newCylinder,
    axis: newAxis,
    addition: formula.addition,
  };
}

/**
 * Calcula la refracción en cerca sumando la adición a la esfera
 */
export function calculateNearVisionSphere(sphere: number, addition?: number): number {
  if (!addition) return sphere;
  return Number((sphere + addition).toFixed(2));
}

/**
 * Valida si un valor dióptrico respeta el paso óptico estándar (0.25 D)
 */
export function isValidDiopterStep(value: number): boolean {
  const remainder = Math.abs(value * 100) % 25;
  return remainder < 0.001 || remainder > 24.999;
}

/**
 * Genera la lista de valores dióptricos para selectores rápidos
 */
export function generateDiopterRange(min: number, max: number, step = 0.25): number[] {
  const list: number[] = [];
  for (let val = min; val <= max; val += step) {
    list.push(Number(val.toFixed(2)));
  }
  return list;
}
