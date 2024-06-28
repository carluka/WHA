package si.feri.um.wha.controllers;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.data.relational.core.sql.In;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.apache.pdfbox.pdmodel.common.PDRectangle.*;
import org.apache.pdfbox.pdmodel.font.PDType0Font;

import jakarta.servlet.http.HttpServletResponse;
import si.feri.um.wha.models.PDFVsebina;
import si.feri.um.wha.models.Stranka;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@RestController
@CrossOrigin
public class PDFController {

    @PostMapping("/generate-pdf")
    public ResponseEntity<byte[]> generatePDF(@RequestBody PDFVsebina vsebina) throws IOException {
        // Create a new document
        PDDocument document = new PDDocument();


        Stranka stranka = vsebina.getStranka();

        try {
            PDPage firstPage = new PDPage();
            document.addPage(firstPage);

            int pageHeight = (int) firstPage.getArtBox().getHeight();
            int pageWidth = (int) firstPage.getArtBox().getWidth();

            // Create a content stream
            PDPageContentStream contentStream = new PDPageContentStream(document, firstPage);

            // Set font and font size
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 15);
            // Calculate positions for text
            float text1X = 25;
            float text1Y = pageHeight - 50;

            float text2X = pageWidth - 135;
            float text2Y = pageHeight - 50;

            // Draw "IME PODJETJA" at the top left corner
            contentStream.beginText();
            contentStream.newLineAtOffset(text1X, text1Y);
            contentStream.showText("IME PODJETJA");
            contentStream.endText();

            // Draw "NAROČILNICA" at the top right corner
            contentStream.beginText();
            contentStream.newLineAtOffset(text2X, text2Y);
            contentStream.showText("NAROCILNICA");
            contentStream.endText();

            // Draw a line below the text
            contentStream.setLineWidth(1.5f);
            contentStream.moveTo(25, text1Y - 5);
            contentStream.lineTo(pageWidth - 25, text1Y - 5);
            contentStream.stroke();

            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
            float leftTextX = 25;
            float leftTextY = text1Y - 50;

            // Draw "KUPEC" below the line on the left side
            contentStream.beginText();
            contentStream.newLineAtOffset(leftTextX, leftTextY);
            contentStream.showText("KUPEC");
            contentStream.endText();

            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);

            // Draw "Trgovina 123" below "KUPEC"
            contentStream.beginText();
            contentStream.newLineAtOffset(leftTextX, leftTextY - 20);
            contentStream.showText(stranka.getNaziv());
            contentStream.endText();

            // Draw "tam nekje" below "Trgovina 123"
            contentStream.beginText();
            contentStream.newLineAtOffset(leftTextX, leftTextY - 35);
            contentStream.showText(stranka.getUlica());
            contentStream.endText();

            // Draw "2000 mb" below "tam nekje"
            contentStream.beginText();
            contentStream.newLineAtOffset(leftTextX, leftTextY - 50);
            contentStream.showText(stranka.getPostnaSt() + " " + stranka.getKraj());
            contentStream.endText();


            float rightTextX = pageWidth - 200; // Adjust as needed
            float rightTextY = text1Y - 50;

            // Draw "Številka Naročila: 123" on the right side
            contentStream.beginText();
            contentStream.newLineAtOffset(rightTextX, rightTextY-15);
            contentStream.showText("Stevilka narocila: "+Integer.toString(vsebina.getNarociloID()));
            contentStream.endText();

            // Draw "Datum: 1.1.2024" below "Številka Naročila"
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            contentStream.beginText();
            contentStream.newLineAtOffset(rightTextX, rightTextY - 30);
            contentStream.showText("Datum kreiranja: "+vsebina.getDatum().format(formatter));
            contentStream.endText();

            // Draw "Fakturiral: Janez" below "Datum"
            contentStream.beginText();
            contentStream.newLineAtOffset(rightTextX, rightTextY - 45);
            contentStream.showText("Fakturiral: "+ vsebina.getZaposleni());
            contentStream.endText();

            contentStream.setStrokingColor(Color.DARK_GRAY);
            contentStream.setLineWidth(0.5f);

            int initX = 50;
            int initY = (int) leftTextY - 150;
            int cellHeight = 30;
            int cellWidth = 100;

            int firstColumnWidth = 200;  // Adjust as needed
            int otherColumnWidth = 100;

            int colCount = 4;
            int rowCount = vsebina.getImenaArtiklov().size()+1;

            ArrayList<String> seznamArtiklov = vsebina.getImenaArtiklov();
            ArrayList<Double> seznamProdajnihCen = vsebina.getSeznamProdajnihCen();
            ArrayList<Integer> seznamKolicin = vsebina.getSeznamKolicin();

            double skupaj = 0;

            // Headers for the first row
            String[] headersTable = {"Artikel", "Kolicina", "Prodajna Cena", "Skupaj"};

            for (int i = 0; i < rowCount; i++) {
                for (int j = 0; j < colCount; j++) {
                    int currentCellWidth = (j == 0) ? firstColumnWidth : otherColumnWidth;
                    contentStream.addRect(initX, initY, currentCellWidth, -cellHeight);

                    contentStream.beginText();
                    contentStream.newLineAtOffset(initX + 10, initY - cellHeight + 10);
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);

                    // Set the headers in the first row
                    if (i == 0) {
                        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                        contentStream.showText(headersTable[j]);
                    } else {
                        switch (j) {
                            case 0:
                                contentStream.showText(seznamArtiklov.get(i - 1));
                                break;

                            case 1:
                                contentStream.showText(Integer.toString(seznamKolicin.get(i - 1)));
                                break;

                            case 2:
                                // Format the double value to limit decimal places to 2
                                String formattedCena = String.format("%.2f", seznamProdajnihCen.get(i - 1));
                                contentStream.showText(formattedCena +" €");
                                break;

                            case 3:
                                double skupajZaArtikel = seznamKolicin.get(i - 1) * seznamProdajnihCen.get(i - 1);
                                skupaj += skupajZaArtikel;

                                // Format the double value to limit decimal places to 2
                                String formattedSkupaj = String.format("%.2f", skupajZaArtikel );
                                contentStream.showText(formattedSkupaj +" €");
                                break;

                            default:
                                break;
                        }
                    }

                    contentStream.endText();

                    initX += currentCellWidth;
                }
                initX = 50;
                initY -= cellHeight;
            }

            contentStream.stroke();

            // Adjust the position for additional text below the table
            float belowTableY = initY - 50; // Adjust as needed

            // Draw "Skupaj: 1000" below the table on the right side
            float rightTextX2 = pageWidth - 150; // Adjust as needed
            contentStream.beginText();
            contentStream.newLineAtOffset(rightTextX2, belowTableY);
            contentStream.showText("Skupaj: " + String.format("%.2f", skupaj)+" €");
            contentStream.endText();

            // Draw "Podpis Stranke:" below the table on the left side
            float leftTextX2 = 50; // Adjust as needed
            contentStream.beginText();
            contentStream.newLineAtOffset(leftTextX2, belowTableY);
            contentStream.showText("Podpis Stranke:");
            contentStream.endText();

            // Draw a line for the person's signature
            float lineLength = 200; // Adjust as needed
            float lineY = belowTableY - 20; // Adjust as needed
            contentStream.setLineWidth(1.5f);
            contentStream.moveTo(leftTextX2 , lineY);
            contentStream.lineTo(leftTextX2  + lineLength, lineY);
            contentStream.stroke();

            contentStream.close();




            // Convert PDF document to byte array
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);

            // Set the response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "generated-pdf.pdf");
            headers.setContentLength(byteArrayOutputStream.size());

            // Return the byte array as a ResponseEntity
            return new ResponseEntity<>(byteArrayOutputStream.toByteArray(), headers, HttpStatus.OK);
        } finally {
            document.close();
        }
    }
}