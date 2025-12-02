"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { courseModels, calculateTotalPrice, phaseModels, type CourseModel } from '@/lib/pricing-models'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { generateProposalPDF } from '@/lib/pdf-generator'
import RoadmapSelector from '@/components/RoadmapSelector'
import { Calculator, Download, Users, BookOpen, Award, Clock, ChevronDown, ChevronUp, FileText, Settings, Shield } from 'lucide-react'

interface ProposalInfo {
  clientName: string
  schoolName: string
  cityState: string
  projectName: string
  contactPerson: string
  email: string
  phone: string
}

export default function PricingCalculator() {
  const [selectedModel, setSelectedModel] = useState<CourseModel>(courseModels[0])
  const [studentCount, setStudentCount] = useState<number>(100)
  const [extraFeatures, setExtraFeatures] = useState<{ [key: string]: number }>({})
  const [expandedFeatures, setExpandedFeatures] = useState<{ [key: string]: boolean }>({})
  const [proposalInfo, setProposalInfo] = useState<ProposalInfo>({
    clientName: '',
    schoolName: '',
    cityState: '',
    projectName: '',
    contactPerson: '',
    email: '',
    phone: ''
  })
  const [showProposal, setShowProposal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true) // TODO: Replace with real auth logic
  const [editingModels, setEditingModels] = useState<CourseModel[]>(courseModels)
  const [activeCourseModels, setActiveCourseModels] = useState<CourseModel[]>(courseModels)
  const [selectedPhases, setSelectedPhases] = useState<string[]>(['fase0'])
  const [manualPricing, setManualPricing] = useState<{ [phaseId: string]: { [lineId: string]: number } }>({})
  const [phaseTeacherCounts, setPhaseTeacherCounts] = useState<{ [phaseId: string]: { [lineId: string]: number } }>({})

  // Load custom models from localStorage on component mount
  useEffect(() => {
    const savedModels = localStorage.getItem('customCourseModels')
    if (savedModels) {
      try {
        const parsedModels = JSON.parse(savedModels)
        setActiveCourseModels(parsedModels)
        setEditingModels(parsedModels)
        setSelectedModel(parsedModels[0])
      } catch (error) {
        console.error('Error loading custom models:', error)
      }
    }
  }, [])

  const pricing = calculateTotalPrice(selectedModel.id, studentCount, selectedPhases, extraFeatures, manualPricing, phaseTeacherCounts)

  const handleStudentCountChange = (value: string) => {
    const count = parseInt(value) || 0
    setStudentCount(Math.max(1, count))
  }

  const handleExtraFeatureChange = (featureId: string, value: number) => {
    setExtraFeatures(prev => ({
      ...prev,
      [featureId]: Math.max(0, value)
    }))
  }

  const handlePhaseToggle = (phaseId: string) => {
    setSelectedPhases(prev => {
      if (prev.includes(phaseId)) {
        return prev.filter(id => id !== phaseId)
      } else {
        return [...prev, phaseId].sort()
      }
    })
  }

  const handleSelectAllPhases = () => {
    setSelectedPhases(phaseModels.map(phase => phase.id))
  }

  const handleClearAllPhases = () => {
    setSelectedPhases([])
  }

  const handleUpdateManualPricing = (phaseId: string, lineId: string, value: number) => {
    setManualPricing(prev => ({
      ...prev,
      [phaseId]: {
        ...prev[phaseId],
        [lineId]: value
      }
    }))
  }

  const handleUpdatePhaseTeacherCount = (phaseId: string, lineId: string, count: number) => {
    setPhaseTeacherCounts(prev => ({
      ...prev,
      [phaseId]: {
        ...prev[phaseId],
        [lineId]: Math.min(Math.max(1, count), 50000)
      }
    }))
  }

  const generateProposal = () => {
    const proposalData = {
      clientName: proposalInfo.clientName,
      schoolName: proposalInfo.schoolName,
      cityState: proposalInfo.cityState,
      projectName: proposalInfo.projectName,
      contactPerson: proposalInfo.contactPerson,
      email: proposalInfo.email,
      phone: proposalInfo.phone,
      selectedModel,
      studentCount,
      pricing,
      extraFeatures,
      selectedPhases,
      phaseModels: pricing.phasePrice.selectedPhaseModels,
      manualPricing
    };

    generateProposalPDF(proposalData);
  }

  const toggleFeatureExpansion = (modelId: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-better-white via-gray-50 to-better-azure/10 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Better Tech Branding */}
        <div className="text-center mb-12">
          <div className="bg-better-black text-better-white p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
            {/* Accent gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-better-azure via-better-green to-better-azure"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-better-green via-better-azure to-better-green"></div>
            
            {/* Admin Button - Top Right */}
            {isAdmin && (
              <div className="absolute top-4 right-4 z-20">
                <Dialog open={showAdminModal} onOpenChange={(open) => {
                  if (open) {
                    setEditingModels([...activeCourseModels])
                  }
                  setShowAdminModal(open)
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-better-white/10 border-better-azure/30 text-better-azure hover:bg-better-azure/20 hover:text-better-white backdrop-blur-sm transition-all duration-300"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Editar Ofertas
                      <Badge variant="secondary" className="ml-2 bg-better-green/20 text-better-black text-xs border-0">
                        ADMIN
                      </Badge>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-better-black">
                        <Settings className="w-5 h-5 text-better-azure" />
                        Gerenciar Ofertas e Preços
                      </DialogTitle>
                      <DialogDescription>
                        Configure os modelos de curso, preços por tier e recursos adicionais
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Course Models Editor */}
                      <Card className="border-better-gray/20">
                        <CardHeader className="bg-gradient-to-r from-better-azure/10 to-better-green/5">
                          <CardTitle className="flex items-center gap-2 text-better-black">
                            <BookOpen className="w-5 h-5 text-better-azure" />
                            Modelos de Curso
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {editingModels.map((model, index) => (
                            <div key={model.id} className="p-4 border rounded-lg space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`model-name-${index}`}>Nome do Modelo</Label>
                                  <Input
                                    id={`model-name-${index}`}
                                    value={model.name}
                                    onChange={(e) => {
                                      const newModels = [...editingModels]
                                      newModels[index].name = e.target.value
                                      setEditingModels(newModels)
                                    }}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`model-desc-${index}`}>Descrição</Label>
                                  <Input
                                    id={`model-desc-${index}`}
                                    value={model.description}
                                    onChange={(e) => {
                                      const newModels = [...editingModels]
                                      newModels[index].description = e.target.value
                                      setEditingModels(newModels)
                                    }}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label>Níveis de Preço</Label>
                                <div className="space-y-2 mt-2">
                                  {model.tiers.map((tier, tierIndex) => (
                                    <div key={tierIndex} className="grid grid-cols-3 gap-2 p-2 bg-gray-50 rounded">
                                      <Input
                                        type="number"
                                        placeholder="Min professores"
                                        value={tier.minStudents}
                                        onChange={(e) => {
                                          const newModels = [...editingModels]
                                          newModels[index].tiers[tierIndex].minStudents = parseInt(e.target.value) || 0
                                          setEditingModels(newModels)
                                        }}
                                      />
                                      <Input
                                        type="number"
                                        placeholder="Max (ou vazio)"
                                        value={tier.maxStudents || ''}
                                        onChange={(e) => {
                                          const newModels = [...editingModels]
                                          newModels[index].tiers[tierIndex].maxStudents = e.target.value ? parseInt(e.target.value) : null
                                          setEditingModels(newModels)
                                        }}
                                      />
                                      <Input
                                        type="number"
                                        placeholder="Preço por professor"
                                        value={tier.pricePerStudent}
                                        onChange={(e) => {
                                          const newModels = [...editingModels]
                                          newModels[index].tiers[tierIndex].pricePerStudent = parseInt(e.target.value) || 0
                                          setEditingModels(newModels)
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Course Features Editing */}
                              <div>
                                <Label>Características do Curso</Label>
                                <div className="space-y-2 mt-2">
                                  {model.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex gap-2">
                                      <Input
                                        value={feature}
                                        onChange={(e) => {
                                          const newModels = [...editingModels]
                                          newModels[index].features[featureIndex] = e.target.value
                                          setEditingModels(newModels)
                                        }}
                                        placeholder="Característica do curso..."
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newModels = [...editingModels]
                                          newModels[index].features.splice(featureIndex, 1)
                                          setEditingModels(newModels)
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newModels = [...editingModels]
                                      newModels[index].features.push('Nova característica')
                                      setEditingModels(newModels)
                                    }}
                                    className="text-better-azure hover:text-better-green"
                                  >
                                    + Adicionar Característica
                                  </Button>
                                </div>
                              </div>
                              
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAdminModal(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        className="bg-better-green hover:bg-better-azure text-better-black"
                        onClick={() => {
                          // Save changes to localStorage for persistence
                          localStorage.setItem('customCourseModels', JSON.stringify(editingModels))
                          
                          // Update active models
                          setActiveCourseModels(editingModels)
                          
                          // Update the selected model if it was modified
                          const updatedSelectedModel = editingModels.find(model => model.id === selectedModel.id)
                          if (updatedSelectedModel) {
                            setSelectedModel(updatedSelectedModel)
                          }
                          
                          setShowAdminModal(false)
                          alert('Alterações salvas com sucesso! As mudanças foram aplicadas.')
                        }}
                      >
                        Salvar Alterações
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <Award className="w-8 h-8 mr-3 text-better-azure" />
                <span className="text-2xl font-bold text-better-azure">BETTER TECH</span>
              </div>
              <h1 className="text-4xl font-bold mb-3">
                Plano Educacional Santa Catarina
              </h1>
              <p className="text-lg text-better-white/80 mb-4">
                Configure sua proposta para implementação educacional em Santa Catarina
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-better-azure/20 rounded-full text-better-azure text-sm font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Inovação em Educação
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Models */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-lg border-better-gray/20 bg-gradient-to-br from-better-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-better-azure/10 to-better-green/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-better-black">
                  <BookOpen className="w-5 h-5 text-better-azure" />
                  Planos de Implementação
                </CardTitle>
                <CardDescription className="text-better-gray">
                  Selecione o plano que melhor atende às necessidades de Santa Catarina
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                {activeCourseModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                      selectedModel.id === model.id
                        ? 'border-better-azure bg-gradient-to-br from-better-azure/10 to-better-green/5 shadow-lg scale-105'
                        : 'border-better-gray/30 hover:border-better-azure/50 bg-better-white hover:bg-gradient-to-br hover:from-better-azure/5 hover:to-transparent'
                    }`}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedModel(model)
                        setExtraFeatures({})
                      }}
                    >
                      <h3 className="font-bold text-xl mb-3 text-better-black">{model.name}</h3>
                      <p className="text-sm text-better-gray mb-4 leading-relaxed">{model.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {model.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="text-xs text-better-gray flex items-start">
                          <span className="text-better-green mr-2 mt-0.5">✓</span>
                          {feature}
                        </div>
                      ))}
                      
                      {model.features.length > 3 && (
                        <Collapsible open={expandedFeatures[model.id]} onOpenChange={() => toggleFeatureExpansion(model.id)}>
                          <CollapsibleTrigger className="flex items-center text-xs text-better-azure hover:text-better-green transition-colors mt-3 font-medium">
                            <span>+{model.features.length - 3} recursos</span>
                            {expandedFeatures[model.id] ? (
                              <ChevronUp className="w-3 h-3 ml-1" />
                            ) : (
                              <ChevronDown className="w-3 h-3 ml-1" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-2">
                            {model.features.slice(3).map((feature, idx) => (
                              <div key={idx + 3} className="text-xs text-better-gray flex items-start">
                                <span className="text-better-green mr-2 mt-0.5">✓</span>
                                {feature}
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Student Count */}
            <Card className="shadow-lg border-better-gray/20 bg-gradient-to-br from-better-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-better-green/10 to-better-azure/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-better-black">
                  <Users className="w-5 h-5 text-better-green" />
                  Número de Professores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={studentCount}
                      onChange={(e) => handleStudentCountChange(e.target.value)}
                      className="w-32"
                      min="1"
                      max="50000"
                    />
                    <span className="text-sm text-gray-600">professores</span>
                  </div>
                  <Slider
                    value={[studentCount]}
                    onValueChange={(value) => setStudentCount(value[0])}
                    max={50000}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>50.000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roadmap Selector */}
            <RoadmapSelector
              selectedPhases={selectedPhases}
              onPhaseToggle={handlePhaseToggle}
              onSelectAll={handleSelectAllPhases}
              onClearAll={handleClearAllPhases}
              studentCount={studentCount}
              manualPricing={manualPricing}
              onUpdateManualPricing={handleUpdateManualPricing}
              phaseTeacherCounts={phaseTeacherCounts}
              onUpdatePhaseTeacherCount={handleUpdatePhaseTeacherCount}
            />

          </div>

          {/* Pricing Summary & Proposal */}
          <div className="space-y-4">
            {/* Pricing Card */}
            <Card className="sticky top-4 shadow-xl border-better-azure/30 bg-gradient-to-br from-better-white via-better-azure/5 to-better-green/5">
              <CardHeader className="bg-gradient-to-r from-better-azure/15 to-better-green/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-better-black">
                  <Calculator className="w-5 h-5 text-better-azure" />
                  Resumo do Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-better-black to-better-gray p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-better-azure to-better-green"></div>
                  <div className="text-center relative z-10">
                    <div className="text-3xl font-bold text-better-azure mb-2">
                      {formatCurrency(pricing.finalTotalPrice)}
                    </div>
                    <div className="text-sm text-better-white/80">
                      Investimento total do projeto
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Professores:</span>
                    <span className="font-medium">{formatNumber(studentCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fases selecionadas:</span>
                    <span className="font-medium">{selectedPhases.length}</span>
                  </div>
                  
                  <div className="border-t pt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Plano base:</span>
                      <span>{formatCurrency(pricing.coursePrice.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fases do roadmap:</span>
                      <span>{formatCurrency(pricing.phasePrice.totalPhasePrice)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2 flex justify-between font-bold text-better-azure">
                    <span>Total:</span>
                    <span>{formatCurrency(pricing.finalTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Valor médio por professor:</span>
                    <span>{formatCurrency(pricing.finalTotalPrice / studentCount)}</span>
                  </div>
                </div>

                {pricing.coursePrice.tier && (
                  <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    <strong>Faixa atual:</strong> {pricing.coursePrice.tier.minStudents} a {pricing.coursePrice.tier.maxStudents || '+'} professores
                    <br />
                    <strong>Preço base do plano:</strong> {formatCurrency(pricing.coursePrice.tier.pricePerStudent)}/professor
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Gerar Proposta PDF</CardTitle>
                <CardDescription>
                  Preencha os dados para gerar uma proposta do Plano Educacional Santa Catarina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    value={proposalInfo.clientName}
                    onChange={(e) => setProposalInfo(prev => ({...prev, clientName: e.target.value}))}
                    placeholder="Ex: Secretaria de Educação"
                  />
                </div>
                <div>
                  <Label htmlFor="schoolName">Instituição/Escola</Label>
                  <Input
                    id="schoolName"
                    value={proposalInfo.schoolName}
                    onChange={(e) => setProposalInfo(prev => ({...prev, schoolName: e.target.value}))}
                    placeholder="Ex: Colégio Bandeirantes"
                  />
                </div>
                <div>
                  <Label htmlFor="cityState">Cidade/Estado</Label>
                  <Input
                    id="cityState"
                    value={proposalInfo.cityState}
                    onChange={(e) => setProposalInfo(prev => ({...prev, cityState: e.target.value}))}
                    placeholder="Ex: São Paulo/SP"
                  />
                </div>
                <div>
                  <Label htmlFor="projectName">Nome do Projeto</Label>
                  <Input
                    id="projectName"
                    value={proposalInfo.projectName}
                    onChange={(e) => setProposalInfo(prev => ({...prev, projectName: e.target.value}))}
                    placeholder="Ex: Capacitação IA 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Pessoa de Contato</Label>
                  <Input
                    id="contactPerson"
                    value={proposalInfo.contactPerson}
                    onChange={(e) => setProposalInfo(prev => ({...prev, contactPerson: e.target.value}))}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={proposalInfo.email}
                    onChange={(e) => setProposalInfo(prev => ({...prev, email: e.target.value}))}
                    placeholder="Ex: maria@escola.com.br"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={proposalInfo.phone}
                    onChange={(e) => setProposalInfo(prev => ({...prev, phone: e.target.value}))}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
                <Button 
                  onClick={generateProposal} 
                  className="w-full bg-gradient-to-r from-better-green to-better-azure hover:from-better-azure hover:to-better-green text-better-black font-bold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Proposta PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}