package tn.esprit.spring.phosphops.DTO;

import lombok.Data;

@Data
public class ProfileUpdateRequest {

    private String nom;
    private String email;
    private String telephone;
    private String departement;
    private String site;


}