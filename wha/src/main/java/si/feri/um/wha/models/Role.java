package si.feri.um.wha.models;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Collection;

@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long ID_role;

    private String name;
    @ManyToMany(mappedBy = "roles")
    private Collection<Zaposleni> users;

    @ManyToMany
    @JoinTable(
            name = "roles_privileges",
            joinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "ID_role"),
            inverseJoinColumns = @JoinColumn(
                    name = "privilege_id", referencedColumnName = "ID_privilege"))

    private Collection<Privilege> privileges;



    public Role (String name) {
        this.name = name;
    }

    public Role() {
    }

    public Role(Long ID_role, String name, Collection<Zaposleni> users, Collection<Privilege> privileges) {
        this.ID_role = ID_role;
        this.name = name;
        this.users = users;
        this.privileges = privileges;
    }

    public Collection<Privilege> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(Collection<Privilege> privileges) {
        this.privileges = privileges;
    }
}
