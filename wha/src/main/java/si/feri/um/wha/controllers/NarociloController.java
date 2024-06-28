package si.feri.um.wha.controllers;

import org.springframework.http.ResponseEntity;
import si.feri.um.wha.dao.NarociloRepository;
import si.feri.um.wha.models.Artikel;
import si.feri.um.wha.models.Narocilo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import si.feri.um.wha.models.Zaposleni;

import java.util.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.StreamSupport;

@RestController
@CrossOrigin
@RequestMapping("/narocila")
public class NarociloController {

    @Autowired
    private NarociloRepository narociloDao;

    @GetMapping
    public Iterable<Narocilo> vrniNarocilo(){
        return narociloDao.findAll();
    }

    @GetMapping("/TODO")
    public List<Narocilo> getTodoNarocila() {
        return narociloDao.findAllTodoNarocila();
    }

    @GetMapping("/{ID_narocilo}")
    public Narocilo vrniDolocenoNarocilo(@PathVariable(name = "ID_narocilo") Long ID_narocilo){
        return narociloDao.vrniDolocenoNarocilo(ID_narocilo);
    }

    @GetMapping("/zasluzek")
    public ResponseEntity<Double> getZasluzekSkupaj() {

        Iterable<Narocilo> allOrders = narociloDao.findAll();

        double total = StreamSupport.stream(allOrders.spliterator(), false)
                .mapToDouble(Narocilo::getCenaSkupaj)
                .sum();

        return ResponseEntity.ok(total);
    }


    @GetMapping("/st_teden1")
    public ResponseEntity<Map<String, Integer>> getNumberOfOrdersForFirstWeek() {
        // Define your start and end dates for the week you want to analyze
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);
        // Adjust the end date to be Friday, not Sunday
        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = startOfWeek.with(DayOfWeek.FRIDAY).atTime(23, 59, 59);

        // Fetch your orders based on the dates
        List<Narocilo> orders = narociloDao.findNarocilaBetweenDates(startDateTime, endDateTime);

        // Calculate the number of orders per day
        Map<String, Integer> ordersPerDay = new LinkedHashMap<>(); // Use LinkedHashMap to maintain insertion order
        LocalDate date = startOfWeek;
        while (!date.isAfter(endDateTime.toLocalDate())) {
            final LocalDateTime finalStartOfDay = date.atStartOfDay();
            final LocalDateTime finalEndOfDay = date.atTime(23, 59, 59);
            int dayOrders = (int) orders.stream()
                    .filter(narocilo -> !narocilo.getDatumVnosa().isBefore(finalStartOfDay) &&
                            !narocilo.getDatumVnosa().isAfter(finalEndOfDay))
                    .count();
            ordersPerDay.put(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.getDefault()), dayOrders);
            date = date.plusDays(1); // Move to the next day
        }

        // Return the map in the response entity
        return ResponseEntity.ok(ordersPerDay);
    }



    @GetMapping("/st_teden2")
    public ResponseEntity<Map<String, Integer>> getNumberOfOrdersForSecondWeek() {
        // Define your start and end dates for the week you want to analyze
        LocalDate startOfWeek = LocalDate.now().minusWeeks(1).with(DayOfWeek.MONDAY);
        // Adjust the end date to be Friday, not Sunday
        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = startOfWeek.with(DayOfWeek.FRIDAY).atTime(23, 59, 59);

        // Fetch your orders based on the dates
        List<Narocilo> orders = narociloDao.findNarocilaBetweenDates(startDateTime, endDateTime);

        // Calculate the number of orders per day
        Map<String, Integer> ordersPerDay = new LinkedHashMap<>(); // Use LinkedHashMap to maintain insertion order
        LocalDate date = startOfWeek;
        while (!date.isAfter(endDateTime.toLocalDate())) {
            final LocalDateTime finalStartOfDay = date.atStartOfDay();
            final LocalDateTime finalEndOfDay = date.atTime(23, 59, 59);
            int dayOrders = (int) orders.stream()
                    .filter(narocilo -> !narocilo.getDatumVnosa().isBefore(finalStartOfDay) &&
                            !narocilo.getDatumVnosa().isAfter(finalEndOfDay))
                    .count();
            ordersPerDay.put(date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.getDefault()), dayOrders);
            date = date.plusDays(1); // Move to the next day
        }

        // Return the map in the response entity
        return ResponseEntity.ok(ordersPerDay);
    }



    @GetMapping("/tedensko/skupaj")
    public ResponseEntity<Double> getTedenSkupaj() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfWeek = today.with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfToday = today.atTime(23, 59, 59);

        List<Narocilo> weeklyOrders = narociloDao.findNarocilaBetweenDates(startOfWeek, endOfToday);

        double total = weeklyOrders.stream()
                .mapToDouble(Narocilo::getCenaSkupaj) // Predpostavljam, da Narocilo ima metodo getCenaSkupaj
                .sum();

        return ResponseEntity.ok(total);
    }


    @GetMapping("/tedensko")
    public ResponseEntity<Map<String, Double>> getWeeklyIncome() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfWeek = today.with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfToday = today.atTime(23, 59, 59);

        List<Narocilo> weeklyOrders = narociloDao.findNarocilaBetweenDates(startOfWeek, endOfToday);

        Map<String, Double> weeklyIncome = new LinkedHashMap<>(); // Uporabite LinkedHashMap za ohranjanje vrstnega reda
        for (LocalDate date = startOfWeek.toLocalDate(); !date.isAfter(today); date = date.plusDays(1)) {
            final LocalDate finalDate = date; // Končna spremenljivka za uporabo v lambda izrazu
            final DayOfWeek day = finalDate.getDayOfWeek();
            double dailyTotal = weeklyOrders.stream()
                    .filter(narocilo -> narocilo.getDatumVnosa().toLocalDate().equals(finalDate))
                    .mapToDouble(Narocilo::getCenaSkupaj)
                    .sum();
            weeklyIncome.put(day.getDisplayName(TextStyle.SHORT, Locale.getDefault()), dailyTotal);
        }

        System.out.println(weeklyIncome);
        return ResponseEntity.ok(weeklyIncome);
    }






    @PostMapping
    public Narocilo dodajNarocilo(@RequestBody Narocilo narocilo){
        ArrayList<Integer> artikli = narocilo.getArtikli();
        ArrayList<Integer> kolicine = narocilo.getSeznamKolicin();
        for(int i = 0; i<artikli.size();i++){
            int trenutniArtikel;
        }
        return narociloDao.save(narocilo);
    }

    @DeleteMapping("/izbrisi/{ID_narocilo}")
    public ResponseEntity<String> izbrisiNarocilo(@PathVariable(name = "ID_narocilo") Long ID_narocilo) throws Exception {
        narociloDao.deleteById(ID_narocilo);
        return ResponseEntity.ok("Uspesno izbrisano narocilo.");
    }

    @PostMapping("/dodaj")
    public ResponseEntity<String> dodajNarocila(@RequestBody List<Narocilo> narocila) {
        Iterable<Narocilo> savedNarocila = narociloDao.saveAll(narocila);
        return ResponseEntity.ok("Uspesno dodana naročila.");
    }

    @PutMapping("/posodobi/{ID_narocilo}")
    public ResponseEntity<String> posodobiNarocilo(@PathVariable(name = "ID_narocilo") Long ID_narocilo, @RequestBody Narocilo updatedNarocilo) {
        Narocilo existingNarocilo = narociloDao.vrniDolocenoNarocilo(ID_narocilo);

        if (existingNarocilo == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedNarocilo.getCenaSkupaj() != 0.0) {
            existingNarocilo.setCenaSkupaj(updatedNarocilo.getCenaSkupaj());
        }
        if (updatedNarocilo.getSeznamKolicin() != null) {
            existingNarocilo.setSeznamKolicin(updatedNarocilo.getSeznamKolicin());
        }
        if (updatedNarocilo.getZaposlen() != null) {
            existingNarocilo.setZaposlen(updatedNarocilo.getZaposlen());
        }
        if (updatedNarocilo.getArtikli() != null) {
            existingNarocilo.setArtikli(updatedNarocilo.getArtikli());
        }
        if (updatedNarocilo.getDatumVnosa() != null) {
            existingNarocilo.setDatumVnosa(updatedNarocilo.getDatumVnosa());
        }
        if (updatedNarocilo.getRokPriprave() != null) {
            existingNarocilo.setRokPriprave(updatedNarocilo.getRokPriprave());
        }
        if (updatedNarocilo.getCasPriprave() != null) {
            existingNarocilo.setCasPriprave(updatedNarocilo.getCasPriprave());
        }
        if (updatedNarocilo.getStanjeNarocila() != null) {
            existingNarocilo.setStanjeNarocila(updatedNarocilo.getStanjeNarocila());
        }
        if(updatedNarocilo.getStranka() != null) {
            existingNarocilo.setStranka(updatedNarocilo.getStranka());
        }

        narociloDao.save(existingNarocilo);

        return ResponseEntity.ok("Naročilo uspešno posodobljeno.");
    }

    @PutMapping("/posodobi/stanje/{ID_narocilo}")
    public ResponseEntity<String> posodobiStanjeNarocila(@PathVariable(name = "ID_narocilo") Long ID_narocilo, @RequestBody Narocilo updatedNarocilo) {
        Narocilo existingNarocilo = narociloDao.vrniDolocenoNarocilo(ID_narocilo);

        if (existingNarocilo == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedNarocilo.getStanjeNarocila() != null) {
            existingNarocilo.setStanjeNarocila(updatedNarocilo.getStanjeNarocila());
        }
        if (updatedNarocilo.getCasPriprave() != null) {
            existingNarocilo.setCasPriprave(updatedNarocilo.getCasPriprave());
        }

        narociloDao.save(existingNarocilo);

        return ResponseEntity.ok("Stanje naročila uspešno posodobljeno.");
    }



}