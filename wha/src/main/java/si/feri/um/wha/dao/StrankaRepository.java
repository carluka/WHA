package si.feri.um.wha.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import si.feri.um.wha.models.Stranka;

import java.util.List;

public interface StrankaRepository extends CrudRepository<Stranka, Long> {
    @Query("select s from Stranka s where s.ID_stranka = :id")
    Stranka vrniDolocenoStranko(@Param("id") Long id);

    List<Stranka> findByNazivContainingIgnoreCase(String naziv);
}
