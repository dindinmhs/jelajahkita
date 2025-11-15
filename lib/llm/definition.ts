import { Type, FunctionDeclaration } from '@google/genai';

export const functionDefinitions: FunctionDeclaration[] = [
  {
    name: 'search_umkm',
    description: 'Mencari UMKM berdasarkan nama, kategori, atau lokasi. Gunakan untuk pencarian UMKM tertentu atau rekomendasi.',
    parameters: {
      type: Type.OBJECT,
      required: ["query"],
      properties: {
        query: {
          type: Type.STRING,
          description: "Text pencarian nama UMKM, produk, atau deskripsi",
        },
        filters: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: ["Semua", "Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian", "Teknologi"],
              description: "Filter kategori UMKM",
            },
            max_distance_km: {
              type: Type.NUMBER,
              description: "Maksimal jarak dari lokasi user dalam kilometer",
            },
            min_rating: {
              type: Type.NUMBER,
              description: "Rating minimal (1-5)",
            }
          },
        },
      },
    },
  },
  {
    name: 'show_umkm_details',
    description: 'Menampilkan detail UMKM dan membuka sidebar. Gunakan ketika user ingin melihat informasi lengkap, jam operasional, produk, atau ulasan UMKM.',
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
    name: 'navigate_to_umkm',
    description: 'Memulai navigasi ke UMKM tertentu. Gunakan ketika user minta rute atau arah ke UMKM.',
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id"],
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
    name: 'highlight_umkm',
    description: 'Highlight UMKM tertentu di peta dengan visual yang menonjol. Gunakan untuk menunjukkan rekomendasi atau hasil pencarian.',
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
          description: "Apakah peta harus zoom untuk menampilkan semua UMKM yang di-highlight",
        }
      },
    },
  },
  {
    name: 'set_category_filter',
    description: 'Mengatur filter kategori UMKM yang ditampilkan di peta.',
    parameters: {
      type: Type.OBJECT,
      required: ["category"],
      properties: {
        category: {
          type: Type.STRING,
          enum: ["Semua", "Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian", "Teknologi"],
          description: "Kategori UMKM untuk ditampilkan di peta",
        }
      },
    },
  },
  {
    name: 'find_nearby_umkm',
    description: 'Mencari UMKM terdekat dari posisi user. Gunakan untuk rekomendasi UMKM sekitar atau "tempat makan terdekat".',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          enum: ["Semua", "Kuliner", "Fashion", "Kerajinan", "Jasa", "Pertanian", "Teknologi"],
          description: "Filter kategori UMKM terdekat yang dicari",
        },
        max_distance_km: {
          type: Type.NUMBER,
          description: "Radius pencarian dalam kilometer (default: 5km)",
        },
        limit: {
          type: Type.NUMBER,
          description: "Jumlah maksimal UMKM yang ditampilkan (default: 10)",
        }
      },
    },
  },
  {
    name: 'open_chat_with_umkm',
    description: 'Membuka chat dengan pemilik UMKM. Gunakan ketika user ingin bertanya atau berkomunikasi dengan UMKM.',
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id", "umkm_name"],
      properties: {
        umkm_id: {
          type: Type.STRING,
          description: "ID UMKM yang akan di-chat",
        },
        umkm_name: {
          type: Type.STRING,
          description: "Nama UMKM untuk ditampilkan di chat window",
        }
      },
    },
  },
  {
    name: 'get_umkm_operational_hours',
    description: 'Mendapatkan informasi jam operasional UMKM. Gunakan ketika user bertanya "buka jam berapa" atau "tutup hari apa".',
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id"],
      properties: {
        umkm_id: {
          type: Type.STRING,
          description: "ID UMKM yang ingin dicek jam operasionalnya",
        },
        day: {
          type: Type.NUMBER,
          description: "Hari yang ingin dicek (1=Senin, 7=Minggu). Kosongkan untuk semua hari.",
        }
      },
    },
  },
  {
    name: 'compare_umkm',
    description: 'Membandingkan beberapa UMKM berdasarkan rating, jarak, atau kategori. Gunakan untuk membantu user memilih.',
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_ids"],
      properties: {
        umkm_ids: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "Array ID UMKM yang akan dibandingkan (2-5 UMKM)",
        },
        compare_by: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: ["rating", "distance", "price", "operational_hours"],
          },
          description: "Aspek yang akan dibandingkan",
        }
      },
    },
  },
  {
    name: 'show_umkm_reviews',
    description: 'Menampilkan ulasan dan rating UMKM. Gunakan ketika user ingin tahu pendapat orang lain tentang UMKM.',
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id"],
      properties: {
        umkm_id: {
          type: Type.STRING,
          description: "ID UMKM yang ulasannya akan ditampilkan",
        },
        min_rating: {
          type: Type.NUMBER,
          description: "Filter rating minimal (1-5)",
        },
        sort_by: {
          type: Type.STRING,
          enum: ["newest", "highest_rating", "lowest_rating"],
          description: "Urutan ulasan yang ditampilkan",
        }
      },
    },
  },
  {
    name: 'get_umkm_catalog',
    description: 'Mendapatkan katalog produk/layanan dari UMKM. Gunakan ketika user bertanya tentang produk, harga, atau menu.',
    parameters: {
      type: Type.OBJECT,
      required: ["umkm_id"],
      properties: {
        umkm_id: {
          type: Type.STRING,
          description: "ID UMKM yang katalognya akan ditampilkan",
        },
        price_range: {
          type: Type.OBJECT,
          properties: {
            min: {
              type: Type.NUMBER,
              description: "Harga minimal",
            },
            max: {
              type: Type.NUMBER,
              description: "Harga maksimal",
            }
          },
        }
      },
    },
  },
  {
    name: 'show_user_location',
    description: 'Menampilkan dan fokus ke lokasi user saat ini di peta. Gunakan ketika user bertanya "dimana saya sekarang".',
    parameters: {
      type: Type.OBJECT,
      properties: {
        zoom_level: {
          type: Type.NUMBER,
          description: "Level zoom peta (default: 15)",
        }
      },
    },
  },
  {
    name: 'change_map_mode',
    description: 'Mengubah tampilan peta (default, 3D, atau satelit).',
    parameters: {
      type: Type.OBJECT,
      required: ["mode"],
      properties: {
        mode: {
          type: Type.STRING,
          enum: ["default", "3d", "satellite"],
          description: "Mode tampilan peta",
        }
      },
    },
  },
  {
    name: 'search_umkm_by_embedding',
    description: 'Mencari UMKM menggunakan similarity search dengan text/image embedding. Gunakan untuk pencarian semantik atau "cari yang mirip dengan...".',
    parameters: {
      type: Type.OBJECT,
      required: ["search_text"],
      properties: {
        search_text: {
          type: Type.STRING,
          description: "Text deskripsi untuk similarity search",
        },
        search_type: {
          type: Type.STRING,
          enum: ["text", "image", "both"],
          description: "Tipe embedding yang digunakan untuk pencarian",
        },
        limit: {
          type: Type.NUMBER,
          description: "Jumlah hasil yang ditampilkan (default: 10)",
        },
        threshold: {
          type: Type.NUMBER,
          description: "Threshold similarity minimum (0-1, default: 0.7)",
        }
      },
    },
  }
] as const;

// Type untuk function call response
export type FunctionName = typeof functionDefinitions[number]['name'];

export interface FunctionCallResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}