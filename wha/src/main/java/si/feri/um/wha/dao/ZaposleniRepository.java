package si.feri.um.wha.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import si.feri.um.wha.models.Artikel;
import si.feri.um.wha.models.Tip_artikla;
import si.feri.um.wha.models.Zaposleni;

import java.util.List;

@Repository
public interface ZaposleniRepository extends CrudRepository<Zaposleni, Long> {

    @Query("select z from Zaposleni z where z.ID_zaposleni = :id")
    Zaposleni vrniDolocenegaZaposlenega(@Param("id") Long id);

    @Query("select z from Zaposleni z where z.username = :username")
    Zaposleni vrniDolocenegaZaposlenegaUsername(@Param("username") String username);

}