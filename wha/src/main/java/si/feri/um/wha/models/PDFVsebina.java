package si.feri.um.wha.models;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.*;

@Entity
public class PDFVsebina {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ID_PDFVsebina;
    @ManyToOne
    private Stranka stranka;
    private int narociloID;
    private LocalDateTime datum;
    private String zaposleni;
    private ArrayList<String> imenaArtiklov;
    private ArrayList<Double> seznamProdajnihCen;
    private ArrayList<Integer> seznamKolicin;

    public PDFVsebina() {
    }


    public PDFVsebina(Long ID_PDFVsebina, Stranka stranka, int narociloID, LocalDateTime datum, String zaposleni, ArrayList<String> imenaArtiklov, ArrayList<Double> seznamProdajnihCen, ArrayList<Integer> seznamKolicin) {
        this.ID_PDFVsebina = ID_PDFVsebina;
        this.stranka = stranka;
        this.narociloID = narociloID;
        this.datum = datum;
        this.zaposleni = zaposleni;
        this.imenaArtiklov = imenaArtiklov;
        this.seznamProdajnihCen = seznamProdajnihCen;
        this.seznamKolicin = seznamKolicin;
    }

    public PDFVsebina(Stranka stranka, int narociloID, LocalDateTime datum, String zaposleni, ArrayList<String> imenaArtiklov, ArrayList<Double> seznamProdajnihCen, ArrayList<Integer> seznamKolicin) {
        this.stranka = stranka;
        this.narociloID = narociloID;
        this.datum = datum;
        this.zaposleni = zaposleni;
        this.imenaArtiklov = imenaArtiklov;
        this.seznamProdajnihCen = seznamProdajnihCen;
        this.seznamKolicin = seznamKolicin;
    }

    public Long getID_PDFVsebina() {
        return ID_PDFVsebina;
    }

    public void setID_PDFVsebina(Long ID_PDFVsebina) {
        this.ID_PDFVsebina = ID_PDFVsebina;
    }

    public Stranka getStranka() {
        return stranka;
    }

    public void setStranka(Stranka stranka) {
        this.stranka = stranka;
    }

    public int getNarociloID() {
        return narociloID;
    }

    public void setNarociloID(int narociloID) {
        this.narociloID = narociloID;
    }

    public LocalDateTime getDatum() {
        return datum;
    }

    public void setDatum(LocalDateTime datum) {
        this.datum = datum;
    }

    public String getZaposleni() {
        return zaposleni;
    }

    public void setZaposleni(String zaposleni) {
        this.zaposleni = zaposleni;
    }

    public ArrayList<String> getImenaArtiklov() {
        return imenaArtiklov;
    }

    public void setImenaArtiklov(ArrayList<String> imenaArtiklov) {
        this.imenaArtiklov = imenaArtiklov;
    }

    public ArrayList<Double> getSeznamProdajnihCen() {
        return seznamProdajnihCen;
    }

    public void setSeznamProdajnihCen(ArrayList<Double> seznamProdajnihCen) {
        this.seznamProdajnihCen = seznamProdajnihCen;
    }

    public ArrayList<Integer> getSeznamKolicin() {
        return seznamKolicin;
    }

    public void setSeznamKolicin(ArrayList<Integer> seznamKolicin) {
        this.seznamKolicin = seznamKolicin;
    }

    @Override
    public String toString() {
        return "PDFVsebina{" +
                "ID_PDFVsebina=" + ID_PDFVsebina +
                ", stranka=" + stranka +
                ", narociloID=" + narociloID +
                ", datum=" + datum +
                ", zaposleni='" + zaposleni + '\'' +
                ", imenaArtiklov=" + imenaArtiklov +
                ", seznamProdajnihCen=" + seznamProdajnihCen +
                ", seznamKolicin=" + seznamKolicin +
                '}';
    }
}
