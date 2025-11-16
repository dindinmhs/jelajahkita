import { Type, FunctionDeclaration } from "@google/genai";

export const functionDefinitions: FunctionDeclaration[] = [
  {
    name: "show_umkm_details",
    description: "Menampilkan detail UMKM dan membuka sidebar. Gunakan ketika user ingin melihat informasi lengkap UMKM.",
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id"],
      properties: {
        umkm_id: {
          type: Type.STRING,
          description: "ID UMKM yang akan ditampilkan detailnya",
        },
        focus_map: {
          type: Type.BOOLEAN,
          description: "Apakah peta harus fokus ke lokasi UMKM ini (default: true)",
        }
      },
    },
  },
  {
    name: "navigate_to_umkm",
    description: "Memulai navigasi ke UMKM tertentu. Gunakan ketika user minta rute atau arah ke UMKM.",
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id", "umkm_name", "coordinates"],
      properties: {
        umkm_id: {
          type: Type.STRING,
          description: "ID UMKM tujuan navigasi",
        },
        umkm_name: {
          type: Type.STRING,
          description: "Nama UMKM untuk ditampilkan di navigasi",
        },
        coordinates: {
          type: Type.ARRAY,
          items: {
            type: Type.NUMBER,
          },
          description: "Koordinat [lon, lat] UMKM tujuan",
        }
      },
    },
  },
  {
    name: "highlight_umkm",
    description: "Highlight UMKM tertentu di peta dengan visual yang menonjol. Gunakan untuk menunjukkan rekomendasi atau hasil pencarian.",
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_ids"],
      properties: {
        umkm_ids: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "Array ID UMKM yang akan di-highlight",
        },
        zoom_to_bounds: {
          type: Type.BOOLEAN,
          description: "Apakah peta harus zoom untuk menampilkan semua UMKM yang di-highlight (default: true)",
        }
      },
    },
  },
] as const;

export type FunctionName = typeof functionDefinitions[number]["name"];

export interface FunctionCallResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}