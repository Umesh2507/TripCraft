import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { TripItineraryData } from '@/components/TripItinerary';

export const downloadItineraryAsPDF = async (itinerary: TripItineraryData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    
    // Check if we need a new page
    if (yPosition + (lines.length * fontSize * 0.5) > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * fontSize * 0.5 + 5;
  };

  // Title
  addText(`${itinerary.destination} Travel Itinerary`, 20, true);
  yPosition += 10;

  // Trip details
  addText(`Duration: ${itinerary.duration}`, 12, true);
  addText(`Travelers: ${itinerary.travelers}`, 12, true);
  addText(`Budget: ${itinerary.totalBudget}`, 12, true);
  yPosition += 10;

  // Overview
  addText('OVERVIEW', 16, true);
  addText(itinerary.overview);
  yPosition += 10;

  // Highlights
  addText('TRIP HIGHLIGHTS', 16, true);
  itinerary.highlights.forEach((highlight, index) => {
    addText(`• ${highlight}`);
  });
  yPosition += 10;

  // Daily Itinerary
  addText('DAILY ITINERARY', 16, true);
  itinerary.days.forEach((day) => {
    addText(`Day ${day.day}: ${day.title}`, 14, true);
    addText(`Date: ${day.date}`);
    addText(`Estimated Cost: ${day.estimatedCost}`);
    addText(`Transportation: ${day.transportation}`);
    yPosition += 5;

    day.activities.forEach((activity) => {
      addText(`${activity.time} - ${activity.title}`, 12, true);
      addText(activity.description);
      addText(`Location: ${activity.location} | Duration: ${activity.duration} | Cost: ${activity.cost}`);
      yPosition += 3;
    });
    yPosition += 10;
  });

  // Travel Tips
  addText('TRAVEL TIPS', 16, true);
  itinerary.tips.forEach((tip) => {
    addText(`• ${tip}`);
  });

  // Save the PDF
  pdf.save(`${itinerary.destination}-itinerary.pdf`);
};

export const downloadItineraryAsWord = async (itinerary: TripItineraryData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: `${itinerary.destination} Travel Itinerary`,
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),

        // Trip Details
        new Paragraph({
          children: [
            new TextRun({
              text: `Duration: ${itinerary.duration} | Travelers: ${itinerary.travelers} | Budget: ${itinerary.totalBudget}`,
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),

        new Paragraph({ text: "" }), // Empty line

        // Overview
        new Paragraph({
          children: [
            new TextRun({
              text: "OVERVIEW",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: itinerary.overview,
              size: 22,
            }),
          ],
        }),

        new Paragraph({ text: "" }), // Empty line

        // Highlights
        new Paragraph({
          children: [
            new TextRun({
              text: "TRIP HIGHLIGHTS",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        ...itinerary.highlights.map(highlight => 
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${highlight}`,
                size: 22,
              }),
            ],
          })
        ),

        new Paragraph({ text: "" }), // Empty line

        // Daily Itinerary
        new Paragraph({
          children: [
            new TextRun({
              text: "DAILY ITINERARY",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        ...itinerary.days.flatMap(day => [
          new Paragraph({
            children: [
              new TextRun({
                text: `Day ${day.day}: ${day.title}`,
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${day.date} | Cost: ${day.estimatedCost} | Transportation: ${day.transportation}`,
                size: 20,
                italics: true,
              }),
            ],
          }),

          ...day.activities.flatMap(activity => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${activity.time} - ${activity.title}`,
                  bold: true,
                  size: 22,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: activity.description,
                  size: 20,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `📍 ${activity.location} | ⏱️ ${activity.duration} | 💰 ${activity.cost}`,
                  size: 18,
                  italics: true,
                }),
              ],
            }),

            new Paragraph({ text: "" }), // Empty line
          ]),

          new Paragraph({ text: "" }), // Empty line between days
        ]),

        // Travel Tips
        new Paragraph({
          children: [
            new TextRun({
              text: "TRAVEL TIPS",
              bold: true,
              size: 28,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
        }),

        ...itinerary.tips.map(tip => 
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${tip}`,
                size: 22,
              }),
            ],
          })
        ),
      ],
    }],
  });

  // Generate and save the document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${itinerary.destination}-itinerary.docx`);
};