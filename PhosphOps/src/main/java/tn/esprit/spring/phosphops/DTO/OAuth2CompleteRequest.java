package tn.esprit.spring.phosphops.DTO;

import lombok.Data;

@Data
public class OAuth2CompleteRequest {
    private String email;
    private String nom;
    private String matricule;
    private String telephone;
    private String site;
    private String departement;
}