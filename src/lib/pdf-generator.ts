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
      return y + (lines.length * (fontSize * 0.4)) + 2; // Better line spacing
    } else {
      pdf.text(text, x, y);
      return y + (fontSize * 0.4) + 2; // Consistent spacing
    }
  };

  // Header with Better Tech brand design
  // Main header background - Grey
  pdf.setFillColor(117, 119, 128); // Better Tech Grey #757780
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  // Accent stripe - Green
  pdf.setFillColor(164, 223, 0); // Better Tech Green #A4DF00
  pdf.rect(0, 0, pageWidth, 5, 'F');
  
  // Better Tech Logo (BETTER TECH text)
  pdf.setTextColor(255, 255, 252); // White text
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BETTER', 20, 22);
  pdf.setTextColor(164, 223, 0); // Green for TECH
  pdf.text('TECH', 90, 22);
  
  // Subtitle with accent color
  pdf.setTextColor(255, 255, 252); // White
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('INOVAÇÃO EM EDUCAÇÃO', 20, 30);
  
  // Document title - properly positioned
  pdf.setTextColor(255, 255, 252);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TEACH Platform - Proposta Comercial', pageWidth - 10, 15, { align: 'right' });
  
  // Date in smaller text
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleDateString('pt-BR'), pageWidth - 10, 25, { align: 'right' });

  yPosition = 45;
  pdf.setTextColor(117, 119, 128); // Better Tech Grey for body text

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('PROPOSTA COMERCIAL - TEACH PLATFORM', 20, yPosition);
  yPosition += 5;

  // Client Information Section with styled background
  const clientSectionHeight = 58;
  pdf.setFillColor(255, 255, 252); // Better Tech White background
  pdf.rect(15, yPosition - 8, pageWidth - 30, clientSectionHeight, 'F');
  
  // Section header with accent
  pdf.setFillColor(164, 223, 0); // Better Tech Green
  pdf.rect(15, yPosition - 8, 8, clientSectionHeight, 'F'); // Wider left accent bar
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText('DADOS DO CLIENTE', 30, yPosition);
  yPosition += 10;

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
    pdf.setTextColor(117, 119, 128); // Better Grey for labels
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 30, yPosition);
    pdf.setTextColor(117, 119, 128); // Better Grey for values
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 110, yPosition); // Better alignment
    yPosition += 6; // Better spacing
  });
  
  yPosition += 3;
  
  // Contact information
  const contactData = [
    [`Contato:`, data.contactPerson || '[Pessoa de Contato]'],
    [`E-mail:`, data.email || '[email@exemplo.com]'],
    [`Telefone:`, data.phone || '[Telefone]']
  ];
  
  contactData.forEach(([label, value]) => {
    pdf.setTextColor(117, 119, 128); // Better Grey
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 30, yPosition);
    pdf.setTextColor(117, 119, 128); // Better Grey
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 110, yPosition); // Better alignment
    yPosition += 6; // Better spacing
  });
  
  yPosition += 15;

  // Course Information Section with light background
  // Calculate dynamic height based on features count
  const featureCount = data.selectedModel.features.length;
  const courseSectionHeight = Math.max(85, 50 + (featureCount * 4));
  
  pdf.setFillColor(248, 248, 248); // Light grey background
  pdf.rect(15, yPosition - 8, pageWidth - 30, courseSectionHeight, 'F');
  
  // Section header with accent
  pdf.setFillColor(164, 223, 0); // Better Tech Green accent
  pdf.rect(15, yPosition - 8, 8, courseSectionHeight, 'F'); // Wider left accent bar
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText(`MODALIDADE: ${data.selectedModel.name}`, 30, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(164, 223, 0); // Better Tech Green for subheaders
  yPosition = addText('Descrição do Curso', 30, yPosition);
  yPosition += 5;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  // Better text wrapping for description
  const descriptionLines = pdf.splitTextToSize(data.selectedModel.description, pageWidth - 80);
  pdf.text(descriptionLines, 30, yPosition);
  yPosition += (descriptionLines.length * 4) + 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(164, 223, 0); // Better Tech Green
  yPosition = addText('Características Incluídas:', 30, yPosition);
  yPosition += 5;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  data.selectedModel.features.forEach((feature, index) => {
    // Use bullet points and better spacing
    const featureLines = pdf.splitTextToSize(`• ${feature}`, pageWidth - 85);
    pdf.text(featureLines, 35, yPosition);
    yPosition += (featureLines.length * 3.5) + 1;
  });
  yPosition += 12;

  // Financial Details Section with professional styling
  const financialSectionHeight = 55;
  pdf.setFillColor(255, 255, 252); // Better Tech White
  pdf.rect(15, yPosition - 8, pageWidth - 30, financialSectionHeight, 'F');
  
  // Section header with accent
  pdf.setFillColor(117, 119, 128); // Better Tech Grey accent
  pdf.rect(15, yPosition - 8, 8, financialSectionHeight, 'F'); // Wider left accent bar
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText('DETALHAMENTO FINANCEIRO', 30, yPosition);
  yPosition += 8;

  // Financial details in organized layout
  const financialData = [
    [`Número de Professores:`, formatNumber(data.studentCount)],
    [`Faixa de Preço:`, `${data.pricing.tier?.minStudents} a ${data.pricing.tier?.maxStudents || '+'} professores`],
    [`Valor por Professor:`, formatCurrency(data.pricing.tier?.pricePerStudent || 0)]
  ];
  
  pdf.setFontSize(11);
  financialData.forEach(([label, value]) => {
    pdf.setTextColor(117, 119, 128); // Better Tech Grey for labels
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 30, yPosition);
    pdf.setTextColor(117, 119, 128); // Better Tech Grey for values
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 130, yPosition);
    yPosition += 5;
  });
  
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(164, 223, 0); // Better Tech Green for subheaders
  yPosition = addText('Investimento Base', 30, yPosition);
  yPosition += 4;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText(`Valor Mensal Base: ${formatCurrency(data.pricing.basePrice)}`, 30, yPosition);

  // Extra features if any
  if (data.pricing.extraPrice > 0) {
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(164, 223, 0); // Better Tech Green
    yPosition = addText('Recursos Adicionais', 30, yPosition);
    yPosition += 4;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(117, 119, 128); // Better Tech Grey
    Object.entries(data.extraFeatures)
      .filter(([_, quantity]) => quantity > 0)
      .forEach(([featureId, quantity]) => {
        const feature = data.selectedModel.extraFeatures?.find(f => f.id === featureId);
        if (feature) {
          const price = feature.pricePerStudent 
            ? feature.pricePerStudent * data.studentCount * quantity 
            : (feature.fixedPrice || 0) * quantity;
          yPosition = addText(`• ${feature.name} (${quantity}x): ${formatCurrency(price)}`, 35, yPosition);
          yPosition += 2;
        }
      });

    yPosition += 3;
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(`Total Recursos Extras: ${formatCurrency(data.pricing.extraPrice)}`, 30, yPosition);
  }

  yPosition += 15;

  // Total Investment - Premium styled section
  pdf.setFillColor(117, 119, 128); // Better Tech Grey background
  pdf.rect(15, yPosition - 8, pageWidth - 30, 40, 'F');
  
  // Accent gradient effect (multiple rectangles for gradient-like effect)
  pdf.setFillColor(164, 223, 0); // Better Tech Green
  pdf.rect(15, yPosition - 8, pageWidth - 30, 3, 'F');
  pdf.setFillColor(164, 223, 0); // Better Tech Green
  pdf.rect(15, yPosition + 29, pageWidth - 30, 3, 'F');
  
  pdf.setTextColor(255, 255, 252); // Better Tech White text
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  
  // Center the title
  const titleWidth = pdf.getTextWidth('INVESTIMENTO TOTAL MENSAL');
  const titleX = (pageWidth - titleWidth) / 2;
  pdf.text('INVESTIMENTO TOTAL MENSAL', titleX, yPosition + 10);
  yPosition += 18;
  
  // Large price display - centered
  pdf.setFontSize(24);
  pdf.setTextColor(164, 223, 0); // Better Tech Green for price
  pdf.setFont('helvetica', 'bold');
  const priceText = formatCurrency(data.pricing.totalPrice);
  const priceWidth = pdf.getTextWidth(priceText);
  const priceX = (pageWidth - priceWidth) / 2;
  pdf.text(priceText, priceX, yPosition);
  yPosition += 12;

  // Per teacher price in smaller text - centered
  pdf.setTextColor(255, 255, 252); // Better Tech White
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'italic');
  const subText = `Valor por professor/mês: ${formatCurrency(data.pricing.pricePerStudent)}`;
  const subWidth = pdf.getTextWidth(subText);
  const subX = (pageWidth - subWidth) / 2;
  pdf.text(subText, subX, yPosition);

  pdf.setTextColor(117, 119, 128); // Reset to Better Tech Grey
  yPosition += 20;

  // Check if we need a new page for additional content
  if (yPosition > pageHeight - 120) {
    pdf.addPage();
    yPosition = 35; // Leave space for page header
    
    // Add mini header for second page
    pdf.setFillColor(117, 119, 128); // Better Tech Grey
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setFillColor(164, 223, 0); // Better Tech Green accent
    pdf.rect(0, 0, pageWidth, 3, 'F');
    
    pdf.setTextColor(255, 255, 252); // Better Tech White
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BETTER', 20, 16);
    pdf.setTextColor(164, 223, 0); // Green
    pdf.text('TECH', 65, 16);
    pdf.setTextColor(255, 255, 252); // White
    pdf.setFontSize(10);
    pdf.text('TEACH Platform - Proposta Comercial', pageWidth - 15, 16, { align: 'right' });
    
    pdf.setTextColor(117, 119, 128); // Reset to Better Tech Grey for content
  } else {
    yPosition += 20;
  }

  // Next Steps Section with styled background
  const nextStepsHeight = 65;
  pdf.setFillColor(248, 248, 248); // Light grey background
  pdf.rect(15, yPosition - 8, pageWidth - 30, nextStepsHeight, 'F');
  
  // Section accent
  pdf.setFillColor(164, 223, 0); // Better Tech Green
  pdf.rect(15, yPosition - 8, 8, nextStepsHeight, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText('PRÓXIMOS PASSOS', 30, yPosition);
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
    const stepLines = pdf.splitTextToSize(`${index + 1}. ${step}`, pageWidth - 80);
    pdf.text(stepLines, 35, yPosition);
    yPosition += (stepLines.length * 4) + 3;
  });

  yPosition += 15;

  // About Better Tech Section with styled background
  const aboutSectionHeight = 50;
  pdf.setFillColor(255, 255, 252); // Better Tech White background
  pdf.rect(15, yPosition - 8, pageWidth - 30, aboutSectionHeight, 'F');
  
  // Section accent
  pdf.setFillColor(164, 223, 0); // Better Tech Green
  pdf.rect(15, yPosition - 8, 8, aboutSectionHeight, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText('SOBRE A BETTER TECH', 30, yPosition);
  yPosition += 8;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const aboutLines = pdf.splitTextToSize(
    'A Better Tech é especializada em soluções educacionais inovadoras, focada em capacitar educadores com as mais modernas tecnologias de IA. Nossa plataforma TEACH representa o futuro da educação brasileira.',
    pageWidth - 70
  );
  pdf.text(aboutLines, 30, yPosition);
  yPosition += (aboutLines.length * 4) + 15;

  // Contact Information Section
  const contactSectionHeight = 35;
  pdf.setFillColor(248, 248, 248); // Light grey background
  pdf.rect(15, yPosition - 8, pageWidth - 30, contactSectionHeight, 'F');
  
  // Section accent
  pdf.setFillColor(117, 119, 128); // Better Tech Grey
  pdf.rect(15, yPosition - 8, 8, contactSectionHeight, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  yPosition = addText('CONTATO PARA DÚVIDAS', 30, yPosition);
  yPosition += 7;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const contactItems = [
    '• E-mail: raphael.ruiz@betteredu.com.br',
    '• Telefone: +55 11 98944-8557', 
    '• Site: www.betteredtech.com.br/home/'
  ];
  
  contactItems.forEach(item => {
    yPosition = addText(item, 35, yPosition);
    yPosition += 1;
  });

  // Footer with Better Tech branding
  yPosition = pageHeight - 35;
  
  // Footer background
  pdf.setFillColor(248, 248, 248); // Light grey
  pdf.rect(0, yPosition - 5, pageWidth, 35, 'F');
  
  // Top accent line
  pdf.setFillColor(164, 223, 0); // Better Tech Green
  pdf.rect(0, yPosition - 5, pageWidth, 2, 'F');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  
  yPosition = addText(`Proposta válida por 30 dias a partir da data de envio.`, 20, yPosition + 5);
  yPosition = addText(`Data: ${currentDate} | Válida até: ${validUntil}`, 20, yPosition + 3);
  
  // Better Tech footer branding - centered and professional
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(117, 119, 128); // Better Tech Grey
  const betterText = 'BETTER';
  const techText = 'TECH';
  const betterWidth = pdf.getTextWidth(betterText);
  const techWidth = pdf.getTextWidth(techText);
  const totalWidth = betterWidth + techWidth;
  const startX = (pageWidth - totalWidth) / 2;
  
  pdf.text(betterText, startX, yPosition);
  pdf.setTextColor(164, 223, 0); // Better Tech Green
  pdf.text(techText, startX + betterWidth, yPosition);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(164, 223, 0); // Better Tech Green
  const tagline = '🇧🇷 Transformando a Educação Brasileira';
  const taglineWidth = pdf.getTextWidth(tagline);
  pdf.text(tagline, (pageWidth - taglineWidth) / 2, yPosition + 8);

  // Save the PDF
  const fileName = `proposta-teach-${data.schoolName || 'cliente'}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}