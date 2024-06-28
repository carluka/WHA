package si.feri.um.wha.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import si.feri.um.wha.dao.Delovni_CasRepository;
import si.feri.um.wha.models.*;
import si.feri.um.wha.models.Delovni_Cas;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/delovni_casi")
public class Delovni_CasController {

    @Autowired
    private Delovni_CasRepository delovni_casDao;
    @GetMapping
    public Iterable<Delovni_Cas> vrniDelovni_Cas(){
        return delovni_casDao.findAll();
    }

    @PostMapping
    public Delovni_Cas dodajDelovni_Cas(@RequestBody Delovni_Cas delovni_cas){
        return delovni_casDao.save(delovni_cas);
    }

    @GetMapping("/{ID_delovni_cas}")
    public Delovni_Cas vrniDolocenDelovniCas(@PathVariable(name = "ID_delovni_cas") Long ID_delovni_cas){
        return delovni_casDao.vrniDolocenDelovniCas(ID_delovni_cas);
    }

    @DeleteMapping("/izbrisi/{ID_delovni_cas}")
    public ResponseEntity<String> izbrisiDelovniCas(@PathVariable(name = "ID_delovni_cas") Long ID_delovni_cas) throws Exception {
        delovni_casDao.deleteById(ID_delovni_cas);
        return ResponseEntity.ok("Uspesno izbrisan delovni_cas.");
    }

    @PostMapping("/dodaj")
    public ResponseEntity<String> dodajDelovniCas(@RequestBody List<Delovni_Cas> delovni_cas) {
        Iterable<Delovni_Cas> savedDelovni_Cas = delovni_casDao.saveAll(delovni_cas);
        return ResponseEntity.ok("Uspesno dodan delovni cas.");
    }

    @PutMapping("/posodobi/{ID_delovni_cas}")
    public ResponseEntity<String> posodobiDelovniCas(@PathVariable(name = "ID_delovni_cas") Long ID_delovni_cas, @RequestBody Delovni_Cas updatedDelovni_Cas) {
        Delovni_Cas existingDelovni_Cas = delovni_casDao.vrniDolocenDelovniCas(ID_delovni_cas);

        if (existingDelovni_Cas == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedDelovni_Cas.getUra_zacetka() != null) {
            existingDelovni_Cas.setUra_zacetka(updatedDelovni_Cas.getUra_zacetka());
        }
        if (updatedDelovni_Cas.getUra_zakljucka() != null) {
            existingDelovni_Cas.setUra_zakljucka(updatedDelovni_Cas.getUra_zakljucka());
        }
        if (updatedDelovni_Cas.getZaposlen() != null) {
            existingDelovni_Cas.setZaposlen(updatedDelovni_Cas.getZaposlen());
        }

        delovni_casDao.save(existingDelovni_Cas);

        return ResponseEntity.ok("Delovni cas uspešno posodobljen.");
    }

    @GetMapping("/search")
    public Iterable<Delovni_Cas> vrniDelovniCasFilter(
            @RequestParam(name = "ura_zacetka", required = false) LocalDateTime ura_zacetka,
            @RequestParam(name = "ura_zakljucka", required = false) LocalDateTime ura_zakljucka,
            @RequestParam(name = "zaposlen", required = false) Zaposleni zaposlen
    ) {
        return delovni_casDao.poisceVseDelovneCasePoKriteriju(ura_zacetka, ura_zakljucka, zaposlen);
    }

    @GetMapping("/zaposleni/{ID_zaposleni}")
    public Iterable<Delovni_Cas> vrniDelovniCasZaposlenega(@PathVariable(name="ID_zaposleni") Long id_zaposleni){
        return delovni_casDao.vrniVseDelovneCaseZaposlenega(id_zaposleni);
    }
}
