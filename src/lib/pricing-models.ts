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

export interface PricingTierLine {
  minTeachers: number;
  maxTeachers: number | null;
  pricePerTeacher: number;
}

export interface PhasePricingLine {
  id: string;
  name: string;
  type: 'per_student' | 'fixed' | 'manual' | 'tiered';
  pricePerStudent?: number;
  fixedPrice?: number;
  tiers?: PricingTierLine[];
  editable: boolean;
}

export interface PhaseModel {
  id: string;
  name: string;
  title: string;
  basePrice: number;
  pricePerStudent: number;
  description: string;
  timeline: string;
  year: string;
  pricingLines: PhasePricingLine[];
}

export const courseModels: CourseModel[] = [
  {
    id: "santa-catarina-essencial",
    name: "Plano Essencial",
    description: "Implementação educacional essencial para Santa Catarina",
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
    id: "santa-catarina-completo",
    name: "Plano Completo",
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
    id: "santa-catarina-transformacional",
    name: "Plano Transformacional",
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
    ]
  }
];

export const phaseModels: PhaseModel[] = [
  {
    id: "fase0",
    name: "Fase 0",
    title: "Preparação",
    basePrice: 0,
    pricePerStudent: 0,
    description: "Estruturação inicial e preparação do programa",
    timeline: "Fev 2026",
    year: "2026",
    pricingLines: [
      {
        id: "async_platform",
        name: "Assíncrono Plataforma",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 5000, pricePerTeacher: 20 },
          { minTeachers: 5001, maxTeachers: 15000, pricePerTeacher: 18 },
          { minTeachers: 15001, maxTeachers: 30000, pricePerTeacher: 15 },
          { minTeachers: 30001, maxTeachers: null, pricePerTeacher: 12 }
        ],
        editable: false
      },
      {
        id: "ambassador_training",
        name: "Treinamento de Embaixadores",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 50, pricePerTeacher: 500 },
          { minTeachers: 51, maxTeachers: 200, pricePerTeacher: 400 },
          { minTeachers: 201, maxTeachers: 500, pricePerTeacher: 350 },
          { minTeachers: 501, maxTeachers: null, pricePerTeacher: 300 }
        ],
        editable: false
      },
      {
        id: "infrastructure",
        name: "Infraestrutura",
        type: "manual",
        fixedPrice: 50000,
        editable: true
      }
    ]
  },
  {
    id: "fase1",
    name: "Fase 1",
    title: "Formação",
    basePrice: 0,
    pricePerStudent: 0,
    description: "Sistema de aprendizagem e formação de replicadores",
    timeline: "1º Sem 2026",
    year: "2026",
    pricingLines: [
      {
        id: "async_platform",
        name: "Assíncrono Plataforma",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 5000, pricePerTeacher: 25 },
          { minTeachers: 5001, maxTeachers: 15000, pricePerTeacher: 22 },
          { minTeachers: 15001, maxTeachers: 30000, pricePerTeacher: 19 },
          { minTeachers: 30001, maxTeachers: null, pricePerTeacher: 16 }
        ],
        editable: false
      },
      {
        id: "ambassador_training",
        name: "Treinamento de Embaixadores",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 50, pricePerTeacher: 600 },
          { minTeachers: 51, maxTeachers: 200, pricePerTeacher: 500 },
          { minTeachers: 201, maxTeachers: 500, pricePerTeacher: 450 },
          { minTeachers: 501, maxTeachers: null, pricePerTeacher: 400 }
        ],
        editable: false
      },
      {
        id: "infrastructure",
        name: "Infraestrutura",
        type: "manual",
        fixedPrice: 75000,
        editable: true
      }
    ]
  },
  {
    id: "fase2",
    name: "Fase 2",
    title: "Escola-Piloto",
    basePrice: 0,
    pricePerStudent: 0,
    description: "Implementação da primeira escola piloto",
    timeline: "2º Sem 2026",
    year: "2026",
    pricingLines: [
      {
        id: "async_platform",
        name: "Assíncrono Plataforma",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 5000, pricePerTeacher: 30 },
          { minTeachers: 5001, maxTeachers: 15000, pricePerTeacher: 27 },
          { minTeachers: 15001, maxTeachers: 30000, pricePerTeacher: 24 },
          { minTeachers: 30001, maxTeachers: null, pricePerTeacher: 20 }
        ],
        editable: false
      },
      {
        id: "ambassador_training",
        name: "Treinamento de Embaixadores",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 50, pricePerTeacher: 700 },
          { minTeachers: 51, maxTeachers: 200, pricePerTeacher: 600 },
          { minTeachers: 201, maxTeachers: 500, pricePerTeacher: 550 },
          { minTeachers: 501, maxTeachers: null, pricePerTeacher: 500 }
        ],
        editable: false
      },
      {
        id: "infrastructure",
        name: "Infraestrutura",
        type: "manual",
        fixedPrice: 100000,
        editable: true
      }
    ]
  },
  {
    id: "fase3",
    name: "Fase 3",
    title: "Modelo Funcional",
    basePrice: 0,
    pricePerStudent: 0,
    description: "Desenvolvimento e validação do modelo funcional",
    timeline: "1º Sem 2027",
    year: "2027-2030",
    pricingLines: [
      {
        id: "async_platform",
        name: "Assíncrono Plataforma",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 5000, pricePerTeacher: 35 },
          { minTeachers: 5001, maxTeachers: 15000, pricePerTeacher: 32 },
          { minTeachers: 15001, maxTeachers: 30000, pricePerTeacher: 29 },
          { minTeachers: 30001, maxTeachers: null, pricePerTeacher: 25 }
        ],
        editable: false
      },
      {
        id: "training",
        name: "Treinamento",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 50, pricePerTeacher: 800 },
          { minTeachers: 51, maxTeachers: 200, pricePerTeacher: 650 },
          { minTeachers: 201, maxTeachers: 500, pricePerTeacher: 550 },
          { minTeachers: 501, maxTeachers: null, pricePerTeacher: 450 }
        ],
        editable: false
      },
      {
        id: "infrastructure",
        name: "Infraestrutura",
        type: "manual",
        fixedPrice: 125000,
        editable: true
      }
    ]
  },
  {
    id: "fase4",
    name: "Fase 4",
    title: "Modelo de Validação",
    basePrice: 0,
    pricePerStudent: 0,
    description: "Estabelecimento de protocolos e padrões",
    timeline: "2º Sem 2027",
    year: "2027-2030",
    pricingLines: [
      {
        id: "async_platform",
        name: "Assíncrono Plataforma",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 5000, pricePerTeacher: 40 },
          { minTeachers: 5001, maxTeachers: 15000, pricePerTeacher: 37 },
          { minTeachers: 15001, maxTeachers: 30000, pricePerTeacher: 34 },
          { minTeachers: 30001, maxTeachers: null, pricePerTeacher: 30 }
        ],
        editable: false
      },
      {
        id: "training",
        name: "Treinamento",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 50, pricePerTeacher: 900 },
          { minTeachers: 51, maxTeachers: 200, pricePerTeacher: 750 },
          { minTeachers: 201, maxTeachers: 500, pricePerTeacher: 650 },
          { minTeachers: 501, maxTeachers: null, pricePerTeacher: 550 }
        ],
        editable: false
      },
      {
        id: "infrastructure",
        name: "Infraestrutura",
        type: "manual",
        fixedPrice: 150000,
        editable: true
      }
    ]
  },
  {
    id: "fase5",
    name: "Fase 5",
    title: "Plano Executivo",
    basePrice: 0,
    pricePerStudent: 0,
    description: "Expansão estadual e implementação completa",
    timeline: "2028-2030",
    year: "2027-2030",
    pricingLines: [
      {
        id: "async_platform",
        name: "Assíncrono Plataforma",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 5000, pricePerTeacher: 45 },
          { minTeachers: 5001, maxTeachers: 15000, pricePerTeacher: 42 },
          { minTeachers: 15001, maxTeachers: 30000, pricePerTeacher: 39 },
          { minTeachers: 30001, maxTeachers: null, pricePerTeacher: 35 }
        ],
        editable: false
      },
      {
        id: "training",
        name: "Treinamento",
        type: "tiered",
        tiers: [
          { minTeachers: 1, maxTeachers: 50, pricePerTeacher: 1000 },
          { minTeachers: 51, maxTeachers: 200, pricePerTeacher: 850 },
          { minTeachers: 201, maxTeachers: 500, pricePerTeacher: 750 },
          { minTeachers: 501, maxTeachers: null, pricePerTeacher: 650 }
        ],
        editable: false
      },
      {
        id: "infrastructure",
        name: "Infraestrutura",
        type: "manual",
        fixedPrice: 200000,
        editable: true
      }
    ]
  }
];

export function calculateTieredPrice(tiers: PricingTierLine[], teacherCount: number): number {
  const tier = tiers.find(t => 
    teacherCount >= t.minTeachers && 
    (t.maxTeachers === null || teacherCount <= t.maxTeachers)
  );
  return tier ? tier.pricePerTeacher * teacherCount : 0;
}

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
  studentCount: number,
  manualPricing: { [phaseId: string]: { [lineId: string]: number } } = {},
  phaseTeacherCounts: { [phaseId: string]: { [lineId: string]: number } } = {},
  customPhaseModels?: PhaseModel[]
): {
  phasePrice: number;
  totalPhasePrice: number;
  pricePerStudentPhase: number;
  selectedPhaseModels: PhaseModel[];
} {
  const phaseModelsToUse = customPhaseModels || phaseModels;
  const selectedPhaseModels = phaseModelsToUse.filter(phase => selectedPhases.includes(phase.id));
  
  let totalPhasePrice = 0;
  
  selectedPhaseModels.forEach(phase => {
    let phaseTotal = 0;
    
    phase.pricingLines.forEach(line => {
      const teacherCountForLine = phaseTeacherCounts[phase.id]?.[line.id] || studentCount;
      
      if (line.type === 'per_student' && line.pricePerStudent) {
        phaseTotal += line.pricePerStudent * teacherCountForLine;
      } else if (line.type === 'fixed' && line.fixedPrice) {
        phaseTotal += line.fixedPrice;
      } else if (line.type === 'manual') {
        const manualPrice = manualPricing[phase.id]?.[line.id] || line.fixedPrice || 0;
        phaseTotal += manualPrice;
      } else if (line.type === 'tiered' && line.tiers) {
        phaseTotal += calculateTieredPrice(line.tiers, teacherCountForLine);
      }
    });
    
    totalPhasePrice += phaseTotal;
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
  extraFeatures: { [key: string]: number } = {},
  manualPricing: { [phaseId: string]: { [lineId: string]: number } } = {},
  phaseTeacherCounts: { [phaseId: string]: { [lineId: string]: number } } = {},
  customPhaseModels?: PhaseModel[]
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
  const phasePrice = calculatePhasePrice(selectedPhases, studentCount, manualPricing, phaseTeacherCounts, customPhaseModels);
  
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