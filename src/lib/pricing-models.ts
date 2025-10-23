export interface PricingTier {
  minStudents: number;
  maxStudents: number | null;
  pricePerStudent: number;
}

export interface CourseModel {
  id: string;
  name: string;
  description: string;
  features: string[];
  tiers: PricingTier[];
  extraFeatures?: {
    id: string;
    name: string;
    description: string;
    pricePerStudent?: number;
    fixedPrice?: number;
    isDefault?: boolean;
  }[];
}

export const courseModels: CourseModel[] = [
  {
    id: "async-digital",
    name: "TEACH Digital",
    description: "Aprendizado assíncrono com flexibilidade total",
    features: [
      "Acesso ilimitado à plataforma",
      "2 workshops mensais",
      "Aula introdutória presencial",
      "Suporte via chat",
      "Certificado de conclusão"
    ],
    tiers: [
      { minStudents: 1, maxStudents: 200, pricePerStudent: 120 },
      { minStudents: 201, maxStudents: 500, pricePerStudent: 105 },
      { minStudents: 501, maxStudents: 1000, pricePerStudent: 95 },
      { minStudents: 1001, maxStudents: null, pricePerStudent: 89 }
    ]
  },
  {
    id: "group-online",
    name: "TEACH Interativo",
    description: "Aulas em grupo online com interação em tempo real",
    features: [
      "Aulas online 2x/semana (90min cada)",
      "Grupos de até 30 estudantes",
      "Acesso às aulas assíncronas",
      "2 workshops mensais",
      "Aula introdutória presencial",
      "Suporte prioritário",
      "Certificado de conclusão"
    ],
    tiers: [
      { minStudents: 1, maxStudents: 200, pricePerStudent: 200 },
      { minStudents: 201, maxStudents: 500, pricePerStudent: 179 },
      { minStudents: 501, maxStudents: null, pricePerStudent: 159 }
    ]
  },
  {
    id: "personalized",
    name: "TEACH Premium",
    description: "Ensino personalizado com grupos reduzidos",
    features: [
      "Grupos de até 10 estudantes",
      "Acesso completo à plataforma",
      "Aulas personalizadas",
      "Workshops ilimitados",
      "Múltiplos encontros presenciais",
      "Suporte 1:1",
      "Certificado premium"
    ],
    tiers: [
      { minStudents: 1, maxStudents: 50, pricePerStudent: 350 },
      { minStudents: 51, maxStudents: 100, pricePerStudent: 320 },
      { minStudents: 101, maxStudents: null, pricePerStudent: 300 }
    ],
    extraFeatures: [
      {
        id: "extra-hours",
        name: "Horas Extras por Semana",
        description: "Adicione mais horas de aula personalizadas",
        pricePerStudent: 25
      },
      {
        id: "extra-workshops",
        name: "Workshops Adicionais",
        description: "Workshops especializados extras por mês",
        pricePerStudent: 15
      },
      {
        id: "in-person-extra",
        name: "Encontros Presenciais Extras",
        description: "Adicione mais encontros presenciais",
        pricePerStudent: 45
      }
    ]
  }
];

export function calculatePrice(
  modelId: string, 
  studentCount: number, 
  extraFeatures: { [key: string]: number } = {}
): {
  basePrice: number;
  extraPrice: number;
  totalPrice: number;
  pricePerStudent: number;
  tier: PricingTier | null;
} {
  const model = courseModels.find(m => m.id === modelId);
  if (!model) {
    return { basePrice: 0, extraPrice: 0, totalPrice: 0, pricePerStudent: 0, tier: null };
  }

  // Find the appropriate tier
  const tier = model.tiers.find(t => 
    studentCount >= t.minStudents && 
    (t.maxStudents === null || studentCount <= t.maxStudents)
  );

  if (!tier) {
    return { basePrice: 0, extraPrice: 0, totalPrice: 0, pricePerStudent: 0, tier: null };
  }

  const basePrice = tier.pricePerStudent * studentCount;
  
  // Calculate extra features price
  let extraPrice = 0;
  if (model.extraFeatures) {
    Object.entries(extraFeatures).forEach(([featureId, quantity]) => {
      const feature = model.extraFeatures?.find(f => f.id === featureId);
      if (feature && quantity > 0) {
        if (feature.pricePerStudent) {
          extraPrice += feature.pricePerStudent * studentCount * quantity;
        } else if (feature.fixedPrice) {
          extraPrice += feature.fixedPrice * quantity;
        }
      }
    });
  }

  const totalPrice = basePrice + extraPrice;

  return {
    basePrice,
    extraPrice,
    totalPrice,
    pricePerStudent: totalPrice / studentCount,
    tier
  };
}