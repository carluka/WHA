package si.feri.um.wha.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import si.feri.um.wha.dao.StrankaRepository;
import si.feri.um.wha.models.Stranka;
import si.feri.um.wha.models.Zaposleni;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/stranka")
public class StrankaController {
    @Autowired
    private StrankaRepository strankaDao;

    @GetMapping
    public Iterable<Stranka> vrniStranka(){
        return strankaDao.findAll();
    }
    @PostMapping
    public Stranka dodajStranko(@RequestBody Stranka stranka){
        return strankaDao.save(stranka);
    }


    @GetMapping("/{ID_stranka}")
    public Stranka vrniDolocenoStranko(@PathVariable(name = "ID_stranka") Long ID_stranka){
        return strankaDao.vrniDolocenoStranko(ID_stranka);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<Stranka>> getStrankaSuggestions(@RequestParam String q) {
        List<Stranka> suggestions = strankaDao.findByNazivContainingIgnoreCase(q);
        return ResponseEntity.ok(suggestions);
    }

    @DeleteMapping("/izbrisi/{ID_stranka}")
    public ResponseEntity<String> izbrisiStranko(@PathVariable(name = "ID_stranka") Long ID_stranka) throws Exception {
        strankaDao.deleteById(ID_stranka);
        return ResponseEntity.ok("Uspesno izbrisana stranka.");
    }

    @PostMapping("/dodaj")
    public ResponseEntity<String> dodajZaposlene(@RequestBody List<Stranka> stranka) {
        Iterable<Stranka> savedstranka = strankaDao.saveAll(stranka);
        return ResponseEntity.ok("Uspesno dodana stranka.");
    }

    @PutMapping("/posodobi/{ID_stranka}")
    public ResponseEntity<String> posodobistranka(@PathVariable(name = "ID_stranka") Long ID_stranka, @RequestBody Stranka updatedstranka) {
        Stranka existingstranka = strankaDao.vrniDolocenoStranko(ID_stranka);

        if (existingstranka == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedstranka.getNaziv() != null) {
            existingstranka.setNaziv(updatedstranka.getNaziv());
        }
        if (updatedstranka.getTelefon() != null) {
            existingstranka.setTelefon(updatedstranka.getTelefon());
        }
        if (updatedstranka.getDrzava() != null) {
            existingstranka.setDrzava(updatedstranka.getDrzava());
        }
        if (updatedstranka.getEmail() != null) {
            existingstranka.setEmail(updatedstranka.getEmail());
        }
        if (updatedstranka.getKraj() != null) {
            existingstranka.setKraj(updatedstranka.getKraj());
        }
        if (updatedstranka.getPostnaSt() != 0) {
            existingstranka.setPostnaSt(updatedstranka.getPostnaSt());
        }
        if (updatedstranka.getUlica() != null) {
            existingstranka.setUlica(updatedstranka.getUlica());
        }
        if (updatedstranka.getEmail() != null) {
            existingstranka.setEmail(updatedstranka.getEmail());
        }

        strankaDao.save(existingstranka);

        return ResponseEntity.ok("stranka uspešno posodobljen.");
    }
}
