"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Calendar, MapPin } from 'lucide-react'

export interface RoadmapPhase {
  id: string
  name: string
  title: string
  description: string
  timeline: string
  deliverables: string[]
  infrastructure?: boolean
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'fase0',
    name: 'Fase 0',
    title: 'Preparação',
    description: 'Estruturação inicial do programa e formação base',
    timeline: 'Fev 2026',
    deliverables: [
      'Curso de IA para Professores',
      'Programa de Formação de Replicadores',
      'Planejamento & Estratégia (Pedagógico, Operacional, Técnico)'
    ],
    infrastructure: true
  },
  {
    id: 'fase1',
    name: 'Fase 1',
    title: 'Formação',
    description: 'Sistema de aprendizagem e primeira turma',
    timeline: '1º Sem 2026',
    deliverables: [
      'Sistema de Aprendizagem Cognitiva',
      '1ª Turma de Replicadores',
      'Criação do Projeto Escola-Piloto (Capacitação, Infraestrutura, Material Pedagógico)'
    ]
  },
  {
    id: 'fase2',
    name: 'Fase 2',
    title: 'Escola-Piloto',
    description: 'Implementação da primeira escola piloto',
    timeline: '2º Sem 2026',
    deliverables: [
      'Formação dos Professores pelos Replicadores',
      'Construção de Conteúdo Pedagógico (BNCC)',
      'Implementação de Infraestrutura Tecnológica para Escola-Piloto'
    ]
  },
  {
    id: 'fase3',
    name: 'Fase 3',
    title: 'Modelo Funcional',
    description: 'Desenvolvimento do modelo funcional e validação',
    timeline: '1º Sem 2027',
    deliverables: [
      'Acompanhamento de Professores e Protocolo de Treino',
      'Validação dos Pedagógica dos Resultados em Aula',
      'Construção e Implementação de Indicadores de Desempenho'
    ]
  },
  {
    id: 'fase4',
    name: 'Fase 4',
    title: 'Modelo de Validação',
    description: 'Estabelecimento de protocolos e padrões',
    timeline: '2º Sem 2027',
    deliverables: [
      'Definição da Base dos Protocolos de Treinamento Técnico',
      'Modelo de Validação Cognitiva de Conteúdo Didático',
      'Desenvolvimento do protocolo padrão de implementação técnico-operacional'
    ]
  },
  {
    id: 'fase5',
    name: 'Fase 5',
    title: 'Plano Executivo',
    description: 'Expansão e implementação estadual',
    timeline: '2028-2030',
    deliverables: [
      'Construção da Rede de Professores Replicadores',
      'Expansão Estadual da Estrutura de Escolas Habilitadas',
      'Plano Estratégico (Humano, Operacional, Técnico)'
    ]
  }
]

interface RoadmapSelectorProps {
  selectedPhases: string[]
  onPhaseToggle: (phaseId: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export default function RoadmapSelector({ 
  selectedPhases, 
  onPhaseToggle, 
  onSelectAll, 
  onClearAll 
}: RoadmapSelectorProps) {
  const isPhaseSelected = (phaseId: string) => selectedPhases.includes(phaseId)
  
  return (
    <Card className="shadow-lg border-better-gray/20 bg-gradient-to-br from-better-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-better-green/10 to-better-azure/5 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-better-black">
            <MapPin className="w-5 h-5 text-better-green" />
            Roadmap de Implementação
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              className="px-3 py-1 text-xs bg-better-green/20 text-better-black rounded-md hover:bg-better-green/30 transition-colors"
            >
              Selecionar Todas
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
        <p className="text-sm text-better-gray">
          Selecione as fases que serão incluídas no escopo da proposta
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Timeline Visual */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            {roadmapPhases.map((phase, index) => (
              <div key={phase.id} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => onPhaseToggle(phase.id)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isPhaseSelected(phase.id)
                      ? 'bg-better-green border-better-green text-white shadow-lg scale-110'
                      : 'bg-white border-better-gray/40 text-better-gray hover:border-better-green/50 hover:scale-105'
                  }`}
                >
                  {isPhaseSelected(phase.id) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <div className="mt-3 text-center">
                  <Badge 
                    variant="outline" 
                    className={`mb-2 ${isPhaseSelected(phase.id) ? 'border-better-green bg-better-green/10' : ''}`}
                  >
                    {phase.name}
                  </Badge>
                  <div className="text-xs text-better-gray font-medium">
                    {phase.timeline}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Connecting Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-better-green via-better-azure to-better-green opacity-30 -z-10"></div>
        </div>

        {/* Phase Details */}
        <div className="space-y-4">
          {roadmapPhases.map((phase) => (
            <div
              key={phase.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                isPhaseSelected(phase.id)
                  ? 'border-better-green bg-gradient-to-r from-better-green/10 to-better-azure/5 shadow-md'
                  : 'border-gray-200 hover:border-better-green/30 hover:bg-gray-50/50'
              }`}
              onClick={() => onPhaseToggle(phase.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className={isPhaseSelected(phase.id) ? 'border-better-green' : ''}>
                      {phase.name}
                    </Badge>
                    <h3 className="font-semibold text-better-black">{phase.title}</h3>
                    <div className="flex items-center text-xs text-better-gray">
                      <Calendar className="w-3 h-3 mr-1" />
                      {phase.timeline}
                    </div>
                  </div>
                  
                  <p className="text-sm text-better-gray mb-3">{phase.description}</p>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-better-black">Entregas:</div>
                    {phase.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="text-xs text-better-gray flex items-start">
                        <span className="text-better-green mr-2 mt-0.5">•</span>
                        {deliverable}
                      </div>
                    ))}
                  </div>
                  
                  {phase.infrastructure && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs bg-better-azure/20 text-better-black">
                        Infraestrutura Alocada
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {isPhaseSelected(phase.id) ? (
                    <CheckCircle className="w-5 h-5 text-better-green" />
                  ) : (
                    <Circle className="w-5 h-5 text-better-gray" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}