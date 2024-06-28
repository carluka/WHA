package si.feri.um.wha.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import si.feri.um.wha.dao.RoleRepository;
import si.feri.um.wha.dao.ZaposleniRepository;
import si.feri.um.wha.models.*;
import si.feri.um.wha.models.Zaposleni;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/zaposleni")
public class ZaposleniController {
    @Autowired
    private ZaposleniRepository zaposleniDao;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public Iterable<Zaposleni> vrniZaposleni(){
        return zaposleniDao.findAll();
    }

    @PostMapping
    public ResponseEntity<String> dodajZaposlenega(@RequestBody Zaposleni zaposleni){

        Optional<Zaposleni> existingZaposleni = Optional.ofNullable(zaposleniDao.vrniDolocenegaZaposlenegaUsername(zaposleni.getUsername()));

        if (existingZaposleni.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // Set the HTTP status to 'Conflict' or another appropriate status
                    .body("Uporabniško ime že obstaja!");
        } else {
            Role role = null;
            Tip_zaposlenega selected_role = zaposleni.getTip_zaposlenega();

            System.out.print(zaposleni);
            if (selected_role.toString().equals("DOKUMENTARIST")) {
                role = roleRepository.findByName("ROLE_DOKUMENTARIST");
            } else if (selected_role.toString().equals("SKLADISCNIK")) {
                role = roleRepository.findByName("ROLE_SKLADISCNIK");
            } else if (selected_role.toString().equals("VODJA_PODJETJA")) {
                role = roleRepository.findByName("ROLE_VODJA_PODJETJA");
            } else if (selected_role.toString().equals("VODJA_SKLADISCA")) {
                role = roleRepository.findByName("ROLE_VODJA_SKLADISCA");
            } else {
                role = null;
            }

            zaposleni.setRoles(Arrays.asList(role));

            zaposleni.setEnabled(true);

            Zaposleni savedZaposleni = zaposleniDao.save(zaposleni);
            return ResponseEntity.ok("Nov zaposleni uspešno dodan.");
        }
    }


    @GetMapping("/preveriAuth/{ID_zaposleni}")
    public ResponseEntity<Boolean> preveriAuth(@PathVariable(name = "ID_zaposleni") Long ID_zaposleni) {
        Zaposleni existingZaposleni = zaposleniDao.vrniDolocenegaZaposlenega(ID_zaposleni);

        if (existingZaposleni != null) {
            boolean isEnabled = existingZaposleni.isEnabled();
            return ResponseEntity.ok(isEnabled);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @PutMapping("/posodobiAuthTrue/{ID_zaposleni}")
    public ResponseEntity<String> spremeniAuthTrue(@PathVariable(name = "ID_zaposleni") Long ID_zaposleni) {
        Zaposleni existingZaposleni = zaposleniDao.vrniDolocenegaZaposlenega(ID_zaposleni);

        if (existingZaposleni == null) {
            return ResponseEntity.notFound().build();
        }
        existingZaposleni.setEnabled(true);

        zaposleniDao.save(existingZaposleni);

        return ResponseEntity.ok("Zaposleni uspešno avtoriziran.");
    }

    @PutMapping("/posodobiAuthFalse/{ID_zaposleni}")
    public ResponseEntity<String> spremeniAuthFalse(@PathVariable(name="ID_zaposleni") Long ID_zaposleni) {
        Zaposleni existingZaposleni = zaposleniDao.vrniDolocenegaZaposlenega(ID_zaposleni);

        if (existingZaposleni == null) {
            return ResponseEntity.notFound().build();
        }
        existingZaposleni.setEnabled(false);

        zaposleniDao.save(existingZaposleni);

        return ResponseEntity.ok("Zaposleni uspešno avtoriziran.");
    }


    @GetMapping("/{ID_zaposleni}")
    public Zaposleni vrniDolocenegaZaposlenega(@PathVariable(name = "ID_zaposleni") Long ID_zaposleni){
        return zaposleniDao.vrniDolocenegaZaposlenega(ID_zaposleni);
    }

    @DeleteMapping("/izbrisi/{ID_zaposleni}")
    public ResponseEntity<String> izbrisiZaposlenega(@PathVariable(name = "ID_zaposleni") Long ID_zaposleni) throws Exception {
        zaposleniDao.deleteById(ID_zaposleni);
        return ResponseEntity.ok("Uspesno izbrisan zaposleni.");
    }

    @PostMapping("/dodaj")
    public ResponseEntity<String> dodajZaposlene(@RequestBody List<Zaposleni> zaposleni) {
        Iterable<Zaposleni> savedZaposleni = zaposleniDao.saveAll(zaposleni);
        return ResponseEntity.ok("Uspesno dodani zaposleni.");
    }

    @PostMapping("/prijava")
    public ResponseEntity<?> prijaviZaposlenega(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        System.out.println(username);

        try {
            Zaposleni zaposleniPodatki = zaposleniDao.vrniDolocenegaZaposlenegaUsername(username);

            if (zaposleniPodatki != null && zaposleniPodatki.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("ime", zaposleniPodatki.getIme());
                response.put("priimek", zaposleniPodatki.getPriimek());
                response.put("id", zaposleniPodatki.getID_zaposleni());
                response.put("role", zaposleniPodatki.getTip_zaposlenega());
                response.put("isAuthenticated", true);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
        }
    }


    @PutMapping("/posodobi/{ID_zaposleni}")
    public ResponseEntity<String> posodobiZaposleni(@PathVariable(name = "ID_zaposleni") Long ID_zaposleni, @RequestBody Zaposleni updatedZaposleni) {
        Zaposleni existingZaposleni = zaposleniDao.vrniDolocenegaZaposlenega(ID_zaposleni);

        if (existingZaposleni == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if the updated username already exists
        Zaposleni zaposleniWithSameUsername = zaposleniDao.vrniDolocenegaZaposlenegaUsername(updatedZaposleni.getUsername());
        if (zaposleniWithSameUsername != null && !existingZaposleni.getID_zaposleni().equals(zaposleniWithSameUsername.getID_zaposleni())) {
            // A different user with the same username already exists, return a conflict response
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) // Set the HTTP status to 'Conflict' or another appropriate status
                    .body("Uporabniško ime že obstaja!");
        }

        if (updatedZaposleni.getIme() != null) {
            existingZaposleni.setIme(updatedZaposleni.getIme());
        }
        if (updatedZaposleni.getPriimek() != null) {
            existingZaposleni.setPriimek(updatedZaposleni.getPriimek());
        }
        if (updatedZaposleni.getUsername() != null) {
            existingZaposleni.setUsername(updatedZaposleni.getUsername());
        }
        if (updatedZaposleni.getPassword() != null) {
            existingZaposleni.setPassword(updatedZaposleni.getPassword());
        }
        if (updatedZaposleni.getEmail() != null) {
            existingZaposleni.setEmail(updatedZaposleni.getEmail());
        }
        if (updatedZaposleni.getTelefon() != null) {
            existingZaposleni.setTelefon(updatedZaposleni.getTelefon());
        }
        if (updatedZaposleni.getPlaca() != 0.0) {
            existingZaposleni.setPlaca(updatedZaposleni.getPlaca());
        }
        if (updatedZaposleni.getTip_zaposlenega() != null) {
            existingZaposleni.setTip_zaposlenega(updatedZaposleni.getTip_zaposlenega());
        }

        zaposleniDao.save(existingZaposleni);

        return ResponseEntity.ok("Zaposleni uspešno posodobljen.");
    }


}
