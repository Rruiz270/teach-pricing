import jsPDF from 'jspdf';
import { formatCurrency, formatNumber } from './utils';
import { CourseModel, PricingTier } from './pricing-models';

interface ProposalData {
  clientName: string;
  schoolName: string;
  cityState: string;
  projectName: string;
  contactPerson: string;
  email: string;
  phone: string;
  selectedModel: CourseModel;
  studentCount: number;
  pricing: {
    basePrice: number;
    extraPrice: number;
    totalPrice: number;
    pricePerStudent: number;
    tier: PricingTier | null;
  };
  extraFeatures: { [key: string]: number };
}

export function generateProposalPDF(data: ProposalData) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let yPosition = 20;

  // Helper function to add text with automatic line wrapping
  const addText = (text: string, x: number, y: number, maxWidth?: number, fontSize = 12) => {
    pdf.setFontSize(fontSize);
    if (maxWidth) {
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35);
    } else {
      pdf.text(text, x, y);
      return y + (fontSize * 0.35);
    }
  };

  // Header with Better Tech logo area
  pdf.setFillColor(59, 130, 246); // Blue color
  pdf.rect(0, 0, pageWidth, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BETTER TECH', 20, 17);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('TEACH Platform - Proposta Comercial', pageWidth - 20, 17, { align: 'right' });

  yPosition = 40;
  pdf.setTextColor(0, 0, 0);

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('PROPOSTA COMERCIAL - TEACH PLATFORM', 20, yPosition);
  yPosition += 10;

  // Client Information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('DADOS DO CLIENTE', 20, yPosition);
  yPosition += 5;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`Cliente: ${data.clientName || '[Nome do Cliente]'}`, 20, yPosition);
  yPosition = addText(`Instituição: ${data.schoolName || '[Nome da Escola]'}`, 20, yPosition);
  yPosition = addText(`Localização: ${data.cityState || '[Cidade/Estado]'}`, 20, yPosition);
  yPosition = addText(`Projeto: ${data.projectName || '[Nome do Projeto]'}`, 20, yPosition);
  yPosition += 5;
  yPosition = addText(`Contato: ${data.contactPerson || '[Pessoa de Contato]'}`, 20, yPosition);
  yPosition = addText(`E-mail: ${data.email || '[email@exemplo.com]'}`, 20, yPosition);
  yPosition = addText(`Telefone: ${data.phone || '[Telefone]'}`, 20, yPosition);
  yPosition += 15;

  // Course Information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText(`MODALIDADE SELECIONADA: ${data.selectedModel.name}`, 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('Descrição do Curso', 20, yPosition);
  yPosition += 3;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(data.selectedModel.description, 20, yPosition, pageWidth - 40);
  yPosition += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('Características Incluídas:', 20, yPosition);
  yPosition += 3;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  data.selectedModel.features.forEach(feature => {
    yPosition = addText(`• ${feature}`, 25, yPosition, pageWidth - 50);
  });
  yPosition += 10;

  // Financial Details
  pdf.setFillColor(248, 250, 252);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 60, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('DETALHAMENTO FINANCEIRO', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`Número de Professores: ${formatNumber(data.studentCount)}`, 20, yPosition);
  yPosition = addText(`Faixa de Preço: ${data.pricing.tier?.minStudents} a ${data.pricing.tier?.maxStudents || '+'} professores`, 20, yPosition);
  yPosition = addText(`Valor por Professor: ${formatCurrency(data.pricing.tier?.pricePerStudent || 0)}`, 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('Investimento Base', 20, yPosition);
  yPosition += 3;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`Valor Mensal Base: ${formatCurrency(data.pricing.basePrice)}`, 20, yPosition);

  // Extra features if any
  if (data.pricing.extraPrice > 0) {
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('Recursos Adicionais', 20, yPosition);
    yPosition += 3;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    Object.entries(data.extraFeatures)
      .filter(([_, quantity]) => quantity > 0)
      .forEach(([featureId, quantity]) => {
        const feature = data.selectedModel.extraFeatures?.find(f => f.id === featureId);
        if (feature) {
          const price = feature.pricePerStudent 
            ? feature.pricePerStudent * data.studentCount * quantity 
            : (feature.fixedPrice || 0) * quantity;
          yPosition = addText(`• ${feature.name} (${quantity}x): ${formatCurrency(price)}`, 25, yPosition);
        }
      });

    yPosition += 5;
    yPosition = addText(`Total Recursos Extras: ${formatCurrency(data.pricing.extraPrice)}`, 20, yPosition);
  }

  yPosition += 15;

  // Total Investment
  pdf.setFillColor(59, 130, 246);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 20, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('INVESTIMENTO TOTAL MENSAL', 20, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(20);
  yPosition = addText(formatCurrency(data.pricing.totalPrice), 20, yPosition);

  pdf.setTextColor(0, 0, 0);
  yPosition += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'italic');
  yPosition = addText(`Valor por professor/mês: ${formatCurrency(data.pricing.pricePerStudent)}`, 20, yPosition);

  // Check if we need a new page
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }

  yPosition += 20;

  // Next Steps
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('PRÓXIMOS PASSOS', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const nextSteps = [
    'Análise da Proposta - Revisão dos termos e condições',
    'Reunião de Alinhamento - Definição de cronograma e expectativas',
    'Contrato - Formalização da parceria',
    'Onboarding - Início do treinamento e suporte'
  ];

  nextSteps.forEach((step, index) => {
    yPosition = addText(`${index + 1}. ${step}`, 25, yPosition, pageWidth - 50);
    yPosition += 2;
  });

  yPosition += 15;

  // About Better Tech
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('SOBRE A BETTER TECH', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(
    'A Better Tech é especializada em soluções educacionais inovadoras, focada em capacitar educadores com as mais modernas tecnologias de IA. Nossa plataforma TEACH representa o futuro da educação brasileira.',
    20, yPosition, pageWidth - 40
  );

  yPosition += 15;

  // Contact Information
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('Contato para Dúvidas:', 20, yPosition);
  yPosition += 5;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('• E-mail: comercial@bettertech.com.br', 25, yPosition);
  yPosition = addText('• Telefone: (11) 9999-9999', 25, yPosition);
  yPosition = addText('• Site: www.bettertech.com.br', 25, yPosition);

  // Footer
  yPosition = pageHeight - 30;
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, yPosition - 5, pageWidth, 30, 'F');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  
  yPosition = addText(`Proposta válida por 30 dias a partir da data de envio.`, 20, yPosition);
  yPosition = addText(`Data: ${currentDate} | Válida até: ${validUntil}`, 20, yPosition);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('🇧🇷 Better Tech - Transformando a Educação Brasileira', pageWidth - 20, yPosition + 8, { align: 'right' });

  // Save the PDF
  const fileName = `proposta-teach-${data.schoolName || 'cliente'}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}