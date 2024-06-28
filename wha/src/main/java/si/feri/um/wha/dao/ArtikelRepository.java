package si.feri.um.wha.dao;

import org.springframework.data.repository.query.Param;
import si.feri.um.wha.models.Artikel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.feri.um.wha.models.Tip_artikla;


public interface ArtikelRepository extends CrudRepository<Artikel, Long> {

    @Query("select a from Artikel a where a.ID_artikel = :id")
    Artikel vrniDolocenArtikel(@Param("id") Long id);


    @Query("SELECT a FROM Artikel a WHERE " +
            "(:naziv IS NULL OR a.naziv LIKE %:naziv%) " +
            "AND (:kolicinaMin IS NULL OR a.kolicina >= :kolicinaMin) " +
            "AND (:kolicinaMax IS NULL OR a.kolicina < :kolicinaMax) " +
            "AND (:prodajna_cenaMin IS NULL OR a.prodajnaCena >= :prodajna_cenaMin) " +
            "AND (:prodajna_cenaMax IS NULL OR a.prodajnaCena < :prodajna_cenaMax) " +
            "AND (:dobavna_cenaMin IS NULL OR a.dobavnaCena >= :dobavna_cenaMin) " +
            "AND (:dobavna_cenaMax IS NULL OR a.dobavnaCena < :dobavna_cenaMax) " +
            "AND (:lokacijaArtikla IS NULL OR a.lokacijaArtikla = :lokacijaArtikla) " +
            "AND (:tipArtiklaEnum IS NULL OR a.tip_artikla = :tipArtiklaEnum)")
    Iterable<Artikel> poisceVseArtiklePoKriteriju(
            @Param("tipArtiklaEnum") Tip_artikla tipArtiklaEnum,
            @Param("naziv") String naziv,
            @Param("kolicinaMin") Integer kolicinaMin,
            @Param("kolicinaMax") Integer kolicinaMax,
            @Param("prodajna_cenaMin") Double prodajna_cenaMin,
            @Param("prodajna_cenaMax") Double prodajna_cenaMax,
            @Param("dobavna_cenaMin") Double dobavna_cenaMin,
            @Param("dobavna_cenaMax") Double dobavna_cenaMax,
            @Param("lokacijaArtikla") String lokacijaArtikla
    );


    @Query("SELECT a FROM Artikel a")
    Iterable<Artikel> findArtikle();


    @Query("SELECT a FROM Artikel a WHERE a.kolicina < 10")
    Iterable<Artikel> findArtikleZNizkoZalogo();

    @Query("SELECT a FROM Artikel a WHERE a.naziv LIKE %:like%")
    Iterable<Artikel> findArtikelLike(String like);

    @Query("SELECT a FROM Artikel a WHERE a.tip_artikla = :tip")
    Iterable<Artikel> poisciPoKategoriji(Tip_artikla tip);
}

