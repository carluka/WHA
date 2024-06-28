package si.feri.um.wha.models;
import com.google.zxing.*;
import com.google.zxing.client.j2se.*;
import com.google.zxing.common.HybridBinarizer;
import com.github.sarxos.webcam.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class QRCodeScannerService {

    public String decodeQRCode() throws IOException, NotFoundException {
        Webcam webcam = Webcam.getDefault();
        if (webcam != null) {
            System.out.println("Webcam: " + webcam.getName());
            webcam.open();
        } else {
            throw new IOException("No webcam detected");
        }

        BufferedImage image = null;
        String decodedText = null;

        if (webcam.isOpen()) {
            if ((image = webcam.getImage()) == null) {
                throw new IOException("Failed to capture image from webcam");
            }
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            Result result = new MultiFormatReader().decode(bitmap);
            decodedText = result.getText();
            webcam.close();
        }

        return decodedText;
    }
}
