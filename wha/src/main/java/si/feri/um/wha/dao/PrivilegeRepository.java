package si.feri.um.wha.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import si.feri.um.wha.models.Privilege;

@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
    Privilege findByName(String name);
    Privilege save(Privilege privilege);
    //@Query("select p from Privilege z where p.name = :name")
    //Privilege findByName(@Param("name") String name);

    //@Query("insert into Privilege (name)")
}
