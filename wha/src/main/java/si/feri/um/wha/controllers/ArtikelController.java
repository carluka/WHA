package si.feri.um.wha.controllers;

import com.github.sarxos.webcam.Webcam;
import com.google.zxing.NotFoundException;
import com.google.zxing.WriterException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import si.feri.um.wha.dao.ArtikelRepository;
import si.feri.um.wha.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/artikli")
public class ArtikelController {

    @Autowired
    private ArtikelRepository artikelDao;

    @GetMapping
    public Iterable<Artikel> vrniArtikel(){
        return artikelDao.findAll();
    }

    @GetMapping("/vsiArtikli")
    public Iterable<Artikel> vrniArtikle() { return artikelDao.findArtikle(); }

    @PostMapping
    public Artikel dodajArtikel(@RequestBody Artikel artikel){
        Tip_artikla izbranTipArtikla = artikel.getTip_artikla();
        System.out.println(artikel);

        artikel.setTip_artikla(izbranTipArtikla);

        // Dodaj if stavek za preverjanje TIP_Artikla
        return artikelDao.save(artikel);
    }

    @GetMapping("/{ID_artikla}")
    public Artikel vrniDolocenArtikel(@PathVariable(name = "ID_artikla") Long ID_artikel){
        return artikelDao.vrniDolocenArtikel(ID_artikel);
    }

    @DeleteMapping("/izbrisi/{ID_artikla}")
    public ResponseEntity<String> izbrisiArtikel(@PathVariable(name = "ID_artikla") Long ID_artikel) throws Exception {
        artikelDao.deleteById(ID_artikel);
        return ResponseEntity.ok("Uspesno izbrisan artikel.");
    }

    @GetMapping("/nizkaZaloga")
    public Iterable<Artikel> vrniArtikelNizkaZaloga() {
        return artikelDao.findArtikleZNizkoZalogo();
    }

    @GetMapping("/search")
    public Iterable<Artikel> vrniArtikleFilter(
            @RequestParam(name = "naziv", required = false) String naziv,
            @RequestParam(name = "kolicinaMin", required = false) Integer kolicinaMin,
            @RequestParam(name = "kolicinaMax", required = false) Integer kolicinaMax,
            @RequestParam(name = "prodajna_cenaMin", required = false) Double prodajna_cenaMin,
            @RequestParam(name = "prodajna_cenaMax", required = false) Double prodajna_cenaMax,
            @RequestParam(name = "dobavna_cenaMin", required = false) Double dobavna_cenaMin,
            @RequestParam(name = "dobavna_cenaMax", required = false) Double dobavna_cenaMax,
            @RequestParam(name = "lokacija_artikla", required = false) String lokacija_artikla,
            @RequestParam(name = "tipArtikla", required = false) String tipArtikla
    ) {
        Tip_artikla tipArtiklaEnum = (tipArtikla != null) ? Tip_artikla.valueOf(tipArtikla) : null;
        return artikelDao.poisceVseArtiklePoKriteriju(tipArtiklaEnum, naziv, kolicinaMin, kolicinaMax, prodajna_cenaMin, prodajna_cenaMax, dobavna_cenaMin, dobavna_cenaMax, lokacija_artikla);
    }

    @PostMapping("/dodaj")
    public ResponseEntity<String> dodajArtikle(@RequestBody List<Artikel> artikli) {
        Iterable<Artikel> savedArtikli = artikelDao.saveAll(artikli);
        return ResponseEntity.ok("Uspesno dodani artikli.");
    }

    @PutMapping("/posodobi/{ID_artikla}")
    public ResponseEntity<String> posodobiArtikel(@PathVariable(name = "ID_artikla") Long ID_artikel, @RequestBody Artikel updatedArtikel) {
        Artikel existingArtikel = artikelDao.vrniDolocenArtikel(ID_artikel);

        if (existingArtikel == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedArtikel.getNaziv() != null) {
            existingArtikel.setNaziv(updatedArtikel.getNaziv());
        }
        if (updatedArtikel.getKolicina() != 0) {
            existingArtikel.setKolicina(updatedArtikel.getKolicina());
        }
        if (updatedArtikel.getProdajnaCena() != 0.0) {
            existingArtikel.setProdajnaCena(updatedArtikel.getProdajnaCena());
        }
        if (updatedArtikel.getDobavnaCena() != 0.0) {
            existingArtikel.setDobavnaCena(updatedArtikel.getDobavnaCena());
        }
        if (updatedArtikel.getLokacijaArtikla() != null) {
            existingArtikel.setLokacijaArtikla(updatedArtikel.getLokacijaArtikla());
        }
        if (updatedArtikel.getTip_artikla() != null) {
            existingArtikel.setTip_artikla(updatedArtikel.getTip_artikla());
        }

        artikelDao.save(existingArtikel);

        return ResponseEntity.ok("Artikel uspešno posodobljen.");
    }

    private static final String QR_CODE_IMAGE_PATH = "/qrcode/QRCode.png";

    @GetMapping("/qrcode/{id_artikla}")
    public String getQRCode(@PathVariable(name = "id_artikla") Long id_artikla, Model model) {

        byte[] image = new byte[0];
        try {
            // Retrieve the Artikel object by ID
            Artikel artikel = artikelDao.vrniDolocenArtikel(id_artikla);

            if (artikel != null) {
                // Serialize the Artikel object to JSON (you can use any serialization method)
                String qrCodeData = String.valueOf(artikel);

                // Generate and Return Qr Code in Byte Array using qrCodeData
                image = QRCodeGenerator.getQRCodeImage(qrCodeData, 250, 250);

                // Generate and Save Qr Code Image using the absolute file path
                QRCodeGenerator.generateQRCodeImage(qrCodeData, 250, 250);
            } else {
                // Handle the case where the Artikel with the specified ID is not found
                // You can return an error message or handle it as per your requirements.
            }
        } catch (WriterException | IOException e) {
            e.printStackTrace();
        }
        // Convert Byte Array into Base64 Encode String
        String qrcode = Base64.getEncoder().encodeToString(image);

        model.addAttribute("qrcode", qrcode);

        return "qrcode";
    }

    private final QRCodeScannerService qrCodeScannerService = new QRCodeScannerService();

    @GetMapping("/scanner")
    public String scanQRCode() {
        try {
            return qrCodeScannerService.decodeQRCode();
        } catch (IOException | NotFoundException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    @PutMapping("/posodobiZalogo/{ID_artikel}")
    public ResponseEntity<String> posodobiZalogo(@PathVariable(name = "ID_artikel") Long ID_artikel, @RequestBody Artikel artikel2) {
        Artikel artikel = artikelDao.vrniDolocenArtikel(ID_artikel);
        int novaKolicina = artikel.getKolicina()-artikel2.getKolicina();
        artikel.setKolicina(novaKolicina);

        artikelDao.save(artikel);

        return ResponseEntity.ok("Zaloga uspešno posodobljena.");
    }


}
