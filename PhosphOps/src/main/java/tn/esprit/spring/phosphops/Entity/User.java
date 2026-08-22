package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long IdUser;


    String Name;


    String email;


    String Password;


    @Enumerated(EnumType.STRING)
    Role role;


    String matricule;


    String telephone;


    String departement;


    String site;


    String dateEntree;


}