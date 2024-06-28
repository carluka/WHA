package si.feri.um.wha.models;

import jakarta.persistence.*;

import java.util.*;

@Entity
public class Stranka {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ID_stranka;
    private String naziv;
    private String kraj;
    private String ulica;
    private int postnaSt;
    private String drzava;
    private String telefon;
    private String email;

    public Stranka() {
    }

    public Stranka(Long ID_stranka, String naziv, String kraj, String ulica, int postnaSt, String drzava, String telefon, String email) {
        this.ID_stranka = ID_stranka;
        this.naziv = naziv;
        this.kraj = kraj;
        this.ulica = ulica;
        this.postnaSt = postnaSt;
        this.drzava = drzava;
        this.telefon = telefon;
        this.email = email;
    }

    public Stranka(String naziv, String kraj, String ulica, int postnaSt, String drzava, String telefon, String email) {
        this.naziv = naziv;
        this.kraj = kraj;
        this.ulica = ulica;
        this.postnaSt = postnaSt;
        this.drzava = drzava;
        this.telefon = telefon;
        this.email = email;
    }

    public Long getID_stranka() {
        return ID_stranka;
    }

    public void setID_stranka(Long ID_stranka) {
        this.ID_stranka = ID_stranka;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getKraj() {
        return kraj;
    }

    public void setKraj(String kraj) {
        this.kraj = kraj;
    }

    public String getUlica() {
        return ulica;
    }

    public void setUlica(String ulica) {
        this.ulica = ulica;
    }

    public int getPostnaSt() {
        return postnaSt;
    }

    public void setPostnaSt(int postnaSt) {
        this.postnaSt = postnaSt;
    }

    public String getDrzava() {
        return drzava;
    }

    public void setDrzava(String drzava) {
        this.drzava = drzava;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Stranka{" +
                "ID_stranka=" + ID_stranka +
                ", naziv='" + naziv + '\'' +
                ", kraj='" + kraj + '\'' +
                ", ulica='" + ulica + '\'' +
                ", postnaSt=" + postnaSt +
                ", drzava='" + drzava + '\'' +
                ", telefon='" + telefon + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
