    package si.feri.um.wha.models;

    import jakarta.persistence.*;

    import java.util.*;

    @Entity
    public class Artikel {
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long ID_artikel;
        private String naziv;
        private int kolicina;
        private double prodajnaCena;
        private double dobavnaCena;
        private String lokacijaArtikla;
        @Enumerated(EnumType.STRING)
        @Column(name = "tip_artikla")
        private Tip_artikla tip_artikla;
        //@ManyToMany(mappedBy = "artikli", cascade = CascadeType.ALL)
        //private Collection<Narocilo> narocila;

        public Artikel() {
        }

        public Artikel(Long ID_artikel, String naziv, int kolicina, double prodajnaCena, double dobavnaCena, String lokacijaArtikla, Tip_artikla tip_artikla, List<Narocilo> narocila) {
            this.ID_artikel = ID_artikel;
            this.naziv = naziv;
            this.kolicina = kolicina;
            this.prodajnaCena = prodajnaCena;
            this.dobavnaCena = dobavnaCena;
            this.lokacijaArtikla = lokacijaArtikla;
            this.tip_artikla = tip_artikla;
            //this.narocila = narocila;
        }

        public Artikel(String naziv, int kolicina, double prodajnaCena, double dobavnaCena, String lokacijaArtikla, Tip_artikla tip_artikla, List<Narocilo> narocila) {
            this.naziv = naziv;
            this.kolicina = kolicina;
            this.prodajnaCena = prodajnaCena;
            this.dobavnaCena = dobavnaCena;
            this.lokacijaArtikla = lokacijaArtikla;
            this.tip_artikla = tip_artikla;
            //this.narocila = narocila;
        }

        public Long getID_artikel() {
            return ID_artikel;
        }

        public void setID_artikel(Long ID_artikel) {
            this.ID_artikel = ID_artikel;
        }

        public String getNaziv() {
            return naziv;
        }

        public void setNaziv(String naziv) {
            this.naziv = naziv;
        }

        public int getKolicina() {
            return kolicina;
        }

        public void setKolicina(int kolicina) {
            this.kolicina = kolicina;
        }

        public double getProdajnaCena() {
            return prodajnaCena;
        }

        public void setProdajnaCena(double prodajnaCena) {
            this.prodajnaCena = prodajnaCena;
        }

        public double getDobavnaCena() {
            return dobavnaCena;
        }

        public void setDobavnaCena(double dobavnaCena) {
            this.dobavnaCena = dobavnaCena;
        }

        public String getLokacijaArtikla() {
            return lokacijaArtikla;
        }

        public void setLokacijaArtikla(String lokacijaArtikla) {
            this.lokacijaArtikla = lokacijaArtikla;
        }

        public Tip_artikla getTip_artikla() {
            return tip_artikla;
        }

        public void setTip_artikla(Tip_artikla tip_artikla) {
            this.tip_artikla = tip_artikla;
        }

       /* public Collection<Narocilo> getNarocila() {
            return narocila;
        }

        public void setNarocila(Collection<Narocilo> narocila) {
            this.narocila = narocila;
        }**/

        @Override
        public String toString() {
            return "Artikel{" +
                    "ID_artikel=" + ID_artikel +
                    ", naziv='" + naziv + '\'' +
                    ", kolicina=" + kolicina +
                    ", prodajnaCena=" + prodajnaCena +
                    ", dobavnaCena=" + dobavnaCena +
                    ", lokacijaArtikla='" + lokacijaArtikla + '\'' +
                    ", tip_artikla=" + tip_artikla +
                    //", narocila=" + narocila +
                    '}';
        }
    }
