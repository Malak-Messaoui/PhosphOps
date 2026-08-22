package tn.esprit.spring.phosphops.DTO;

import lombok.Data;

@Data
public class RegisterRequest {

    private String nom;
    private String matricule;
    private String email;
    private String password;
    private String telephone;
    private String site;
    private String departement;
}