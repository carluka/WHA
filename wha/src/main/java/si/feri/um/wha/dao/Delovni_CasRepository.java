package si.feri.um.wha.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import si.feri.um.wha.models.Artikel;
import si.feri.um.wha.models.Delovni_Cas;
import si.feri.um.wha.models.Tip_artikla;
import si.feri.um.wha.models.Zaposleni;

import java.time.LocalDateTime;

public interface Delovni_CasRepository extends CrudRepository<Delovni_Cas, Long>{

    @Query("select d from Delovni_Cas d where d.ID_delovni_cas = :id")
    Delovni_Cas vrniDolocenDelovniCas(@Param("id") Long id);

    @Query("SELECT d FROM Delovni_Cas d WHERE " +
            "(:ura_zacetka IS NULL OR d.ura_zacetka >= :ura_zacetka) " +
            "AND (:ura_zakljucka IS NULL OR d.ura_zakljucka <= :ura_zakljucka) " +
            "AND (:zaposlen IS NULL OR d.zaposlen = :zaposlen)")
    Iterable<Delovni_Cas> poisceVseDelovneCasePoKriteriju(
            @Param("ura_zacetka") LocalDateTime ura_zacetka,
            @Param("ura_zakljucka") LocalDateTime ura_zakljucka,
            @Param("zaposlen") Zaposleni zaposlen
    );

    @Query("SELECT d FROM Delovni_Cas d WHERE d.zaposlen.ID_zaposleni = :id_zaposleni")
    Iterable<Delovni_Cas> vrniVseDelovneCaseZaposlenega(@Param("id_zaposleni") Long id_zaposleni);
}
