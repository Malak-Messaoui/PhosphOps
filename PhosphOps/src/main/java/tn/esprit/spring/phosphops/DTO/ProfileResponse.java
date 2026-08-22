package tn.esprit.spring.phosphops.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProfileResponse {


    private Long id;

    private String nom;

    private String email;

    private String role;

    private String matricule;

    private String telephone;

    private String departement;

    private String site;

    private String dateEntree;


}