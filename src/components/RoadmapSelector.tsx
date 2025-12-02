"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Calendar, MapPin, Info } from 'lucide-react'
import PhaseDetailModal from '@/components/PhaseDetailModal'
import { phaseModels, PhaseModel } from '@/lib/pricing-models'


interface RoadmapSelectorProps {
  selectedPhases: string[]
  onPhaseToggle: (phaseId: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  studentCount: number
  manualPricing: { [phaseId: string]: { [lineId: string]: number } }
  onUpdateManualPricing: (phaseId: string, lineId: string, value: number) => void
  phaseTeacherCounts: { [phaseId: string]: { [lineId: string]: number } }
  onUpdatePhaseTeacherCount: (phaseId: string, lineId: string, count: number) => void
}

export default function RoadmapSelector({ 
  selectedPhases, 
  onPhaseToggle, 
  onSelectAll, 
  onClearAll,
  studentCount,
  manualPricing,
  onUpdateManualPricing,
  phaseTeacherCounts,
  onUpdatePhaseTeacherCount
}: RoadmapSelectorProps) {
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState<PhaseModel | null>(null)
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
            {phaseModels.map((phase, index) => (
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
          {phaseModels.map((phase) => (
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
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-better-black">
                        Estrutura de Preços: {phase.pricingLines.length} componentes
                      </div>
                      <div className="text-xs text-better-gray">
                        Ano: {phase.year}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPhaseForModal(phase)
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-better-azure/10 text-better-azure rounded-full hover:bg-better-azure/20 transition-colors text-xs font-medium"
                    >
                      <Info className="w-3 h-3" />
                      Ver Preços
                    </button>
                  </div>
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

        {/* Phase Detail Modal */}
        <PhaseDetailModal
          phase={selectedPhaseForModal}
          isOpen={!!selectedPhaseForModal}
          onClose={() => setSelectedPhaseForModal(null)}
          studentCount={studentCount}
          manualPricing={manualPricing[selectedPhaseForModal?.id || ''] || {}}
          onUpdateManualPricing={(lineId, value) => {
            if (selectedPhaseForModal) {
              onUpdateManualPricing(selectedPhaseForModal.id, lineId, value)
            }
          }}
          phaseTeacherCounts={phaseTeacherCounts[selectedPhaseForModal?.id || ''] || {}}
          onUpdatePhaseTeacherCounts={(lineId, count) => {
            if (selectedPhaseForModal) {
              onUpdatePhaseTeacherCount(selectedPhaseForModal.id, lineId, count)
            }
          }}
        />
      </CardContent>
    </Card>
  )
}