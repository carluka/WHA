package si.feri.um.wha.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Delovni_Cas {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ID_delovni_cas;
    private LocalDateTime ura_zacetka;
    private LocalDateTime ura_zakljucka;
    @ManyToOne
    @JoinColumn(name = "ID_zaposleni")
    private Zaposleni zaposlen;

    public Delovni_Cas() {
    }

    public Delovni_Cas(Long ID_delovni_cas, LocalDateTime ura_zacetka, LocalDateTime ura_zakljucka, Zaposleni zaposlen) {
        this.ID_delovni_cas = ID_delovni_cas;
        this.ura_zacetka = ura_zacetka;
        this.ura_zakljucka = ura_zakljucka;
        this.zaposlen = zaposlen;
    }

    public Delovni_Cas(LocalDateTime ura_zacetka, LocalDateTime ura_zakljucka, Zaposleni zaposlen) {
        this.ura_zacetka = ura_zacetka;
        this.ura_zakljucka = ura_zakljucka;
        this.zaposlen = zaposlen;
    }

    public Long getID_delovni_cas() {
        return ID_delovni_cas;
    }

    public void setID_delovni_cas(Long ID_delovni_cas) {
        this.ID_delovni_cas = ID_delovni_cas;
    }

    public LocalDateTime getUra_zacetka() {
        return ura_zacetka;
    }

    public void setUra_zacetka(LocalDateTime ura_zacetka) {
        this.ura_zacetka = ura_zacetka;
    }

    public LocalDateTime getUra_zakljucka() {
        return ura_zakljucka;
    }

    public void setUra_zakljucka(LocalDateTime ura_zakljucka) {
        this.ura_zakljucka = ura_zakljucka;
    }

    public Zaposleni getZaposlen() {
        return zaposlen;
    }

    public void setZaposlen(Zaposleni zaposlen) {
        this.zaposlen = zaposlen;
    }

    public void dodajDelovniCas() {
        throw new UnsupportedOperationException();
    }

    @Override
    public String toString() {
        return "Delovni_Cas{" +
                "ID_delovni_cas=" + ID_delovni_cas +
                ", ura_zacetka=" + ura_zacetka +
                ", ura_zakljucka=" + ura_zakljucka +
                ", zaposlen=" + zaposlen +
                '}';
    }
}
