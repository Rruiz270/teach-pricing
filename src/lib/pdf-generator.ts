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

  // Header with Better Tech brand design
  // Main header background - Rich Black
  pdf.setFillColor(0, 16, 17); // Better Tech Rich Black #001011
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  // Accent stripe - Pale Azure
  pdf.setFillColor(108, 207, 246); // Better Tech Pale Azure #6CCFF6
  pdf.rect(0, 0, pageWidth, 5, 'F');
  
  // Better Tech logo and title
  pdf.setTextColor(255, 255, 252); // Baby Powder text
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BETTER TECH', 20, 22);
  
  // Subtitle with accent color
  pdf.setTextColor(108, 207, 246); // Pale Azure
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('INOVAÇÃO EM EDUCAÇÃO', 20, 30);
  
  // Document title
  pdf.setTextColor(255, 255, 252);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TEACH Platform - Proposta Comercial', pageWidth - 20, 22, { align: 'right' });
  
  // Date in smaller text
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleDateString('pt-BR'), pageWidth - 20, 30, { align: 'right' });

  yPosition = 50;
  pdf.setTextColor(0, 16, 17); // Better Tech Rich Black for body text

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('PROPOSTA COMERCIAL - TEACH PLATFORM', 20, yPosition);
  yPosition += 10;

  // Client Information Section with styled background
  pdf.setFillColor(248, 250, 252); // Light background
  pdf.rect(15, yPosition - 5, pageWidth - 30, 45, 'F');
  
  // Section header with accent
  pdf.setFillColor(108, 207, 246); // Pale Azure
  pdf.rect(15, yPosition - 5, 5, 45, 'F'); // Left accent bar
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 16, 17);
  yPosition = addText('DADOS DO CLIENTE', 25, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Client details in organized layout
  const clientData = [
    [`Cliente:`, data.clientName || '[Nome do Cliente]'],
    [`Instituição:`, data.schoolName || '[Nome da Escola]'],
    [`Localização:`, data.cityState || '[Cidade/Estado]'],
    [`Projeto:`, data.projectName || '[Nome do Projeto]']
  ];
  
  clientData.forEach(([label, value]) => {
    pdf.setTextColor(117, 119, 128); // Better Gray for labels
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 25, yPosition);
    pdf.setTextColor(0, 16, 17); // Rich Black for values
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 80, yPosition);
    yPosition += 6;
  });
  
  yPosition += 3;
  
  // Contact information
  const contactData = [
    [`Contato:`, data.contactPerson || '[Pessoa de Contato]'],
    [`E-mail:`, data.email || '[email@exemplo.com]'],
    [`Telefone:`, data.phone || '[Telefone]']
  ];
  
  contactData.forEach(([label, value]) => {
    pdf.setTextColor(117, 119, 128);
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 25, yPosition);
    pdf.setTextColor(0, 16, 17);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 80, yPosition);
    yPosition += 6;
  });
  
  yPosition += 15;

  // Course Information Section with Pale Azure background
  pdf.setFillColor(230, 248, 254); // Light Pale Azure background
  pdf.rect(15, yPosition - 5, pageWidth - 30, 60, 'F');
  
  // Section header with accent
  pdf.setFillColor(164, 223, 0); // Yellow Green accent
  pdf.rect(15, yPosition - 5, 5, 60, 'F'); // Left accent bar
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 16, 17);
  yPosition = addText(`MODALIDADE SELECIONADA: ${data.selectedModel.name}`, 25, yPosition);
  yPosition += 12;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(108, 207, 246); // Pale Azure for subheaders
  yPosition = addText('Descrição do Curso', 25, yPosition);
  yPosition += 5;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 16, 17);
  yPosition = addText(data.selectedModel.description, 25, yPosition, pageWidth - 50);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(108, 207, 246);
  yPosition = addText('Características Incluídas:', 25, yPosition);
  yPosition += 5;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 16, 17);
  data.selectedModel.features.forEach(feature => {
    yPosition = addText(`✓ ${feature}`, 30, yPosition, pageWidth - 60);
    yPosition += 1;
  });
  yPosition += 15;

  // Financial Details Section with professional styling
  pdf.setFillColor(248, 250, 252);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 65, 'F');
  
  // Section header with accent
  pdf.setFillColor(117, 119, 128); // Better Gray accent
  pdf.rect(15, yPosition - 5, 5, 65, 'F'); // Left accent bar
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 16, 17);
  yPosition = addText('DETALHAMENTO FINANCEIRO', 25, yPosition);
  yPosition += 10;

  // Financial details in organized layout
  const financialData = [
    [`Número de Professores:`, formatNumber(data.studentCount)],
    [`Faixa de Preço:`, `${data.pricing.tier?.minStudents} a ${data.pricing.tier?.maxStudents || '+'} professores`],
    [`Valor por Professor:`, formatCurrency(data.pricing.tier?.pricePerStudent || 0)]
  ];
  
  pdf.setFontSize(11);
  financialData.forEach(([label, value]) => {
    pdf.setTextColor(117, 119, 128); // Better Gray for labels
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 25, yPosition);
    pdf.setTextColor(0, 16, 17); // Rich Black for values
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 120, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(108, 207, 246); // Pale Azure for subheaders
  yPosition = addText('Investimento Base', 25, yPosition);
  yPosition += 5;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 16, 17);
  yPosition = addText(`Valor Mensal Base: ${formatCurrency(data.pricing.basePrice)}`, 25, yPosition);

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

  // Total Investment - Premium styled section
  pdf.setFillColor(0, 16, 17); // Rich Black background
  pdf.rect(15, yPosition - 5, pageWidth - 30, 35, 'F');
  
  // Accent gradient effect (multiple rectangles for gradient-like effect)
  pdf.setFillColor(108, 207, 246); // Pale Azure
  pdf.rect(15, yPosition - 5, pageWidth - 30, 3, 'F');
  pdf.setFillColor(164, 223, 0); // Yellow Green
  pdf.rect(15, yPosition + 30, pageWidth - 30, 2, 'F');
  
  pdf.setTextColor(255, 255, 252); // Baby Powder text
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('INVESTIMENTO TOTAL MENSAL', 25, yPosition + 5);
  yPosition += 10;
  
  // Large price display
  pdf.setFontSize(24);
  pdf.setTextColor(108, 207, 246); // Pale Azure for price
  pdf.setFont('helvetica', 'bold');
  yPosition = addText(formatCurrency(data.pricing.totalPrice), 25, yPosition);

  // Per teacher price in smaller text
  pdf.setTextColor(255, 255, 252);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'italic');
  yPosition = addText(`Valor por professor/mês: ${formatCurrency(data.pricing.pricePerStudent)}`, 25, yPosition + 5);

  pdf.setTextColor(0, 16, 17); // Reset to Rich Black
  yPosition += 20;

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

  // Footer with Better Tech branding
  yPosition = pageHeight - 35;
  
  // Footer background
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, yPosition - 5, pageWidth, 35, 'F');
  
  // Top accent line
  pdf.setFillColor(108, 207, 246); // Pale Azure
  pdf.rect(0, yPosition - 5, pageWidth, 2, 'F');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(117, 119, 128); // Better Gray
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  
  yPosition = addText(`Proposta válida por 30 dias a partir da data de envio.`, 20, yPosition + 5);
  yPosition = addText(`Data: ${currentDate} | Válida até: ${validUntil}`, 20, yPosition + 3);
  
  // Better Tech footer branding
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 16, 17); // Rich Black
  pdf.text('BETTER TECH', pageWidth - 20, yPosition, { align: 'right' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(108, 207, 246); // Pale Azure
  pdf.text('🇧🇷 Transformando a Educação Brasileira', pageWidth - 20, yPosition + 8, { align: 'right' });

  // Save the PDF
  const fileName = `proposta-teach-${data.schoolName || 'cliente'}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}