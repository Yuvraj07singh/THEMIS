import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

/** Build a DOCX from plain text with paragraph breaks, with a standard legal layout. */
export async function textToDocx({ title, bodyText, footerNote }) {
  const paragraphs = [];

  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text: title, bold: true, size: 28 })],
  }));

  for (const block of bodyText.split(/\n\s*\n/)) {
    const lines = block.split('\n');
    for (const line of lines) {
      paragraphs.push(new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: line, size: 23 })],
      }));
    }
  }

  if (footerNote) {
    paragraphs.push(new Paragraph({ spacing: { before: 400 } }));
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: footerNote, italics: true, size: 18, color: '666666' })],
    }));
  }

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  return Packer.toBuffer(doc);
}
