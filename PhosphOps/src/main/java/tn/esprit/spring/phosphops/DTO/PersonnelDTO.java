package tn.esprit.spring.phosphops.DTO;

import lombok.*;
import tn.esprit.spring.phosphops.Entity.Poste;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonnelDTO {
    private Long idPersonnel;
    private String fullName;
    private String email;
    private Poste poste;
    private String matricule;
}