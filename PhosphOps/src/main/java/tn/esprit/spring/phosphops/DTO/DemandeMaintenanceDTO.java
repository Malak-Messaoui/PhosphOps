package tn.esprit.spring.phosphops.DTO;

import lombok.*;
import tn.esprit.spring.phosphops.Entity.Priorite;
import tn.esprit.spring.phosphops.Entity.TypePanne;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeMaintenanceDTO {
    private Long idDemande;

    private Long idPanne;
    private String matriculeEquipement;
    private TypePanne typePanne;
    private String descPanne;
    private Priorite priorite;
    private String photoUrl;

    private Long idTechnicien;
    private String nomTechnicien;

    private String status;
    private LocalDateTime dateDemande;
    private String commentaireAdmin;
}