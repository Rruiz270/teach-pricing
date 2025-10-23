"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { courseModels, calculatePrice, type CourseModel } from '@/lib/pricing-models'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { generateProposalPDF } from '@/lib/pdf-generator'
import { Calculator, Download, Users, BookOpen, Award, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react'

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

  const pricing = calculatePrice(selectedModel.id, studentCount, extraFeatures)

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
      extraFeatures
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TEACH Platform - Calculadora de Preços
          </h1>
          <p className="text-lg text-gray-600">
            Configure sua proposta comercial para cursos de IA para educadores
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Award className="w-4 h-4 mr-1" />
            Produto Better Tech
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course Models */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Modalidades de Curso
                </CardTitle>
                <CardDescription>
                  Selecione o modelo de curso que melhor atende às necessidades do cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                {courseModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedModel.id === model.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedModel(model)
                        setExtraFeatures({})
                      }}
                    >
                      <h3 className="font-semibold text-lg mb-2">{model.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    </div>
                    
                    <div className="space-y-1">
                      {model.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="text-xs text-gray-500">• {feature}</div>
                      ))}
                      
                      {model.features.length > 3 && (
                        <Collapsible open={expandedFeatures[model.id]} onOpenChange={() => toggleFeatureExpansion(model.id)}>
                          <CollapsibleTrigger className="flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors mt-2">
                            <span>+{model.features.length - 3} recursos</span>
                            {expandedFeatures[model.id] ? (
                              <ChevronUp className="w-3 h-3 ml-1" />
                            ) : (
                              <ChevronDown className="w-3 h-3 ml-1" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-1">
                            {model.features.slice(3).map((feature, idx) => (
                              <div key={idx + 3} className="text-xs text-gray-500">• {feature}</div>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
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
                    />
                    <span className="text-sm text-gray-600">professores</span>
                  </div>
                  <Slider
                    value={[studentCount]}
                    onValueChange={(value) => setStudentCount(value[0])}
                    max={2000}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>2.000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extra Features */}
            {selectedModel.extraFeatures && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recursos Adicionais
                  </CardTitle>
                  <CardDescription>
                    Personalize ainda mais a oferta com recursos extras
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedModel.extraFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {feature.pricePerStudent && `+${formatCurrency(feature.pricePerStudent)}/professor`}
                          {feature.fixedPrice && `+${formatCurrency(feature.fixedPrice)} fixo`}
                        </p>
                      </div>
                      <Input
                        type="number"
                        value={extraFeatures[feature.id] || 0}
                        onChange={(e) => handleExtraFeatureChange(feature.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pricing Summary & Proposal */}
          <div className="space-y-4">
            {/* Pricing Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Resumo do Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(pricing.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Investimento mensal total
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Professores:</span>
                    <span className="font-medium">{formatNumber(studentCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor base:</span>
                    <span>{formatCurrency(pricing.basePrice)}</span>
                  </div>
                  {pricing.extraPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Recursos extras:</span>
                      <span>{formatCurrency(pricing.extraPrice)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Valor por professor:</span>
                    <span>{formatCurrency(pricing.pricePerStudent)}</span>
                  </div>
                </div>

                {pricing.tier && (
                  <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    <strong>Faixa atual:</strong> {pricing.tier.minStudents} a {pricing.tier.maxStudents || '+'} professores
                    <br />
                    <strong>Preço base:</strong> {formatCurrency(pricing.tier.pricePerStudent)}/professor
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Gerar Proposta PDF</CardTitle>
                <CardDescription>
                  Preencha os dados para gerar uma proposta comercial profissional em PDF
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
                <Button onClick={generateProposal} className="w-full">
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