package si.feri.um.wha.models;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;


public class QRCodeGenerator {

    //private static final String IMAGE_PATH = "/Users/rokfonovic/Desktop/Sola/2_LETNIK/RIS/Projekt/qrcodes";

    private static final String IMAGE_PATH = "/Users/Aljaz/OneDrive/Dokumenti/FERI/RIS/Projekt1/qrcodes";
    private static int imageNumber = 0;

    public static void generateQRCodeImage(String text, int width, int height)
            throws WriterException, IOException {
        String fileName = getImageFileName();
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        String filePath = IMAGE_PATH + "/" + fileName;
        Path path = FileSystems.getDefault().getPath(filePath);

        // Check if the file with the same name already exists
        while (Files.exists(path)) {
            fileName = getImageFileName();
            filePath = IMAGE_PATH + "/" + fileName;
            path = FileSystems.getDefault().getPath(filePath);
        }

        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }

    private static String getImageFileName() {
        String fileName = "QRCode.png";
        if (imageNumber > 0) {
            fileName = "QRCode" + imageNumber + ".png";
        }
        imageNumber++;
        return fileName;
    }




    public static byte[] getQRCodeImage(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageConfig con = new MatrixToImageConfig( 0xFF000002 , 0xFFFFC041 ) ;

        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream,con);
        byte[] pngData = pngOutputStream.toByteArray();
        return pngData;
    }

}
