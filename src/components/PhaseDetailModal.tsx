"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PhaseModel, PhasePricingLine } from '@/lib/pricing-models'
import { formatCurrency } from '@/lib/utils'
import { Calculator, DollarSign, Users, Settings } from 'lucide-react'

interface PhaseDetailModalProps {
  phase: PhaseModel | null
  isOpen: boolean
  onClose: () => void
  studentCount: number
  manualPricing: { [lineId: string]: number }
  onUpdateManualPricing: (lineId: string, value: number) => void
}

export default function PhaseDetailModal({
  phase,
  isOpen,
  onClose,
  studentCount,
  manualPricing,
  onUpdateManualPricing
}: PhaseDetailModalProps) {
  if (!phase) return null

  const calculateLineTotal = (line: PhasePricingLine): number => {
    if (line.type === 'per_student' && line.pricePerStudent) {
      return line.pricePerStudent * studentCount
    } else if (line.type === 'fixed' && line.fixedPrice) {
      return line.fixedPrice
    } else if (line.type === 'manual') {
      return manualPricing[line.id] || line.fixedPrice || 0
    }
    return 0
  }

  const totalPhasePrice = phase.pricingLines.reduce((total, line) => total + calculateLineTotal(line), 0)

  const handleManualPriceChange = (lineId: string, value: string) => {
    const numValue = parseInt(value) || 0
    onUpdateManualPricing(lineId, numValue)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-better-black">
            <Calculator className="w-6 h-6 text-better-azure" />
            <div>
              <span className="text-better-azure">{phase.name}</span> - {phase.title}
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 text-better-gray">
              <span>{phase.timeline}</span>
              <span>•</span>
              <span className="font-medium">{phase.year}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="p-4 bg-gradient-to-r from-better-azure/10 to-better-green/5 rounded-lg">
            <p className="text-better-gray">{phase.description}</p>
          </div>

          {/* Professor Count Info */}
          <div className="flex items-center gap-3 p-4 bg-better-white border border-better-gray/20 rounded-lg">
            <Users className="w-5 h-5 text-better-green" />
            <div>
              <Label className="text-sm font-medium text-better-black">
                Número de Professores
              </Label>
              <div className="text-2xl font-bold text-better-green">
                {studentCount.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Pricing Lines */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-better-azure" />
              <Label className="text-lg font-semibold text-better-black">
                Estrutura de Preços
              </Label>
            </div>

            {phase.pricingLines.map((line) => (
              <div
                key={line.id}
                className="p-4 border border-better-gray/20 rounded-lg bg-gradient-to-r from-better-white to-gray-50/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-better-black">{line.name}</h4>
                    {line.type === 'per_student' && (
                      <p className="text-sm text-better-gray">
                        {formatCurrency(line.pricePerStudent || 0)} por professor
                      </p>
                    )}
                    {line.type === 'fixed' && (
                      <p className="text-sm text-better-gray">Valor fixo</p>
                    )}
                    {line.type === 'manual' && line.editable && (
                      <p className="text-sm text-better-azure flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        Valor editável
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-better-azure">
                      {formatCurrency(calculateLineTotal(line))}
                    </div>
                    {line.type === 'per_student' && (
                      <div className="text-xs text-better-gray">
                        {formatCurrency(line.pricePerStudent || 0)} × {studentCount.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Price Input */}
                {line.type === 'manual' && line.editable && (
                  <div className="mt-3 pt-3 border-t border-better-gray/20">
                    <Label htmlFor={`manual-${line.id}`} className="text-sm text-better-gray">
                      Valor customizado
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-better-gray">R$</span>
                      <Input
                        id={`manual-${line.id}`}
                        type="number"
                        value={manualPricing[line.id] || line.fixedPrice || ''}
                        onChange={(e) => handleManualPriceChange(line.id, e.target.value)}
                        className="flex-1"
                        placeholder="Digite o valor..."
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="p-6 bg-gradient-to-r from-better-black to-better-gray rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-better-azure to-better-green"></div>
            <div className="relative z-10">
              <div className="text-center">
                <div className="text-sm text-better-white/80 mb-2">
                  Total da {phase.name}
                </div>
                <div className="text-3xl font-bold text-better-azure">
                  {formatCurrency(totalPhasePrice)}
                </div>
                {studentCount > 0 && (
                  <div className="text-sm text-better-white/60 mt-2">
                    Valor médio por professor: {formatCurrency(totalPhasePrice / studentCount)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-better-gray/20">
            <Button
              onClick={onClose}
              className="bg-better-green hover:bg-better-azure text-better-black font-medium px-6"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}