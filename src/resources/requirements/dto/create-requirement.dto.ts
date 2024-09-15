import { Prisma } from '@prisma/client';

export class CreateRequirementDto {
  /**
     * example:  {
        title: "Coûts de Production et Revenu Vital",
        numero: "3.1",
        content: [
          {
            text: "La direction du groupe collecte les données sur les facteurs déterminants des coûts de production (ex : coûts des engrais, des produits agrochimiques, travail payé, équipement) et calcule le revenu net d'un culture agricole certifié pour un échantillon des membres du groupe (c’est-à-dire : revenu brut – coûts de production = revenu net) . La direction du groupe partage les données analysées avec les membres du groupe.",
            num: "3.1.1",
            certif_de_group: {
              direction_du_group: "yes",
              petite_exploitation_agricole: "no",
              grande_exploitation_agricole: "no"
            }
          },
     */
  content: Prisma.JsonValue;
  /**
   * example: "3.1"
   */
  numero: string;
  /**
   * example: "Coûts de Production et Revenu Vital"
   */
  title: string;
}
