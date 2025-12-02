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

export interface PhaseModel {
  id: string;
  name: string;
  title: string;
  basePrice: number;
  pricePerStudent: number;
  description: string;
  timeline: string;
}

export const courseModels: CourseModel[] = [
  {
    id: "santa-catarina-basic",
    name: "Plano Básico SC",
    description: "Implementação educacional básica para Santa Catarina",
    features: [
      "Formação inicial de professores",
      "Sistema de aprendizagem cognitiva",
      "Acompanhamento pedagógico",
      "Suporte técnico básico",
      "Relatórios de progresso"
    ],
    tiers: [
      { minStudents: 1, maxStudents: 200, pricePerStudent: 150 },
      { minStudents: 201, maxStudents: 500, pricePerStudent: 135 },
      { minStudents: 501, maxStudents: 1000, pricePerStudent: 125 },
      { minStudents: 1001, maxStudents: null, pricePerStudent: 115 }
    ]
  },
  {
    id: "santa-catarina-advanced",
    name: "Plano Avançado SC",
    description: "Implementação educacional completa com replicadores",
    features: [
      "Formação completa de replicadores",
      "Sistema cognitivo avançado",
      "Escola-piloto dedicada",
      "Acompanhamento intensivo",
      "Protocolo de validação",
      "Infraestrutura tecnológica",
      "Suporte especializado 24/7"
    ],
    tiers: [
      { minStudents: 1, maxStudents: 200, pricePerStudent: 280 },
      { minStudents: 201, maxStudents: 500, pricePerStudent: 250 },
      { minStudents: 501, maxStudents: null, pricePerStudent: 220 }
    ]
  },
  {
    id: "santa-catarina-premium",
    name: "Plano Premium SC",
    description: "Implementação estadual completa com expansão",
    features: [
      "Rede completa de replicadores",
      "Múltiplas escolas-piloto",
      "Validação pedagógica completa",
      "Expansão estadual planejada",
      "Protocolos técnico-operacionais",
      "Indicadores de desempenho avançados",
      "Suporte executivo dedicado"
    ],
    tiers: [
      { minStudents: 1, maxStudents: 50, pricePerStudent: 450 },
      { minStudents: 51, maxStudents: 100, pricePerStudent: 420 },
      { minStudents: 101, maxStudents: null, pricePerStudent: 390 }
    ],
    extraFeatures: [
      {
        id: "extra-schools",
        name: "Escolas-Piloto Extras",
        description: "Adicione mais escolas ao programa piloto",
        pricePerStudent: 35
      },
      {
        id: "extra-training",
        name: "Treinamento Especializado",
        description: "Módulos de treinamento especializados adicionais",
        pricePerStudent: 25
      },
      {
        id: "infrastructure-upgrade",
        name: "Upgrade de Infraestrutura",
        description: "Melhorias tecnológicas avançadas",
        pricePerStudent: 55
      }
    ]
  }
];

export const phaseModels: PhaseModel[] = [
  {
    id: "fase0",
    name: "Fase 0",
    title: "Preparação",
    basePrice: 50000,
    pricePerStudent: 15,
    description: "Estruturação inicial e preparação do programa",
    timeline: "Fev 2026"
  },
  {
    id: "fase1",
    name: "Fase 1",
    title: "Formação",
    basePrice: 75000,
    pricePerStudent: 25,
    description: "Sistema de aprendizagem e formação de replicadores",
    timeline: "1º Sem 2026"
  },
  {
    id: "fase2",
    name: "Fase 2",
    title: "Escola-Piloto",
    basePrice: 100000,
    pricePerStudent: 35,
    description: "Implementação da primeira escola piloto",
    timeline: "2º Sem 2026"
  },
  {
    id: "fase3",
    name: "Fase 3",
    title: "Modelo Funcional",
    basePrice: 125000,
    pricePerStudent: 45,
    description: "Desenvolvimento e validação do modelo funcional",
    timeline: "1º Sem 2027"
  },
  {
    id: "fase4",
    name: "Fase 4",
    title: "Modelo de Validação",
    basePrice: 150000,
    pricePerStudent: 55,
    description: "Estabelecimento de protocolos e padrões",
    timeline: "2º Sem 2027"
  },
  {
    id: "fase5",
    name: "Fase 5",
    title: "Plano Executivo",
    basePrice: 200000,
    pricePerStudent: 65,
    description: "Expansão estadual e implementação completa",
    timeline: "2028-2030"
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

export function calculatePhasePrice(
  selectedPhases: string[],
  studentCount: number
): {
  phasePrice: number;
  totalPhasePrice: number;
  pricePerStudentPhase: number;
  selectedPhaseModels: PhaseModel[];
} {
  const selectedPhaseModels = phaseModels.filter(phase => selectedPhases.includes(phase.id));
  
  let totalPhasePrice = 0;
  
  selectedPhaseModels.forEach(phase => {
    totalPhasePrice += phase.basePrice + (phase.pricePerStudent * studentCount);
  });
  
  return {
    phasePrice: totalPhasePrice,
    totalPhasePrice,
    pricePerStudentPhase: studentCount > 0 ? totalPhasePrice / studentCount : 0,
    selectedPhaseModels
  };
}

export function calculateTotalPrice(
  modelId: string,
  studentCount: number,
  selectedPhases: string[],
  extraFeatures: { [key: string]: number } = {}
): {
  coursePrice: ReturnType<typeof calculatePrice>;
  phasePrice: ReturnType<typeof calculatePhasePrice>;
  finalTotalPrice: number;
  breakdown: {
    courseTotal: number;
    phaseTotal: number;
    extraTotal: number;
  };
} {
  const coursePrice = calculatePrice(modelId, studentCount, extraFeatures);
  const phasePrice = calculatePhasePrice(selectedPhases, studentCount);
  
  const finalTotalPrice = coursePrice.totalPrice + phasePrice.totalPhasePrice;
  
  return {
    coursePrice,
    phasePrice,
    finalTotalPrice,
    breakdown: {
      courseTotal: coursePrice.basePrice,
      phaseTotal: phasePrice.totalPhasePrice,
      extraTotal: coursePrice.extraPrice
    }
  };
}