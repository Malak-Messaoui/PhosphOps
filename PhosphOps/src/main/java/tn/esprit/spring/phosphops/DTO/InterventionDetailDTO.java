package tn.esprit.spring.phosphops.DTO;

import lombok.*;
import tn.esprit.spring.phosphops.Entity.Priorite;
import tn.esprit.spring.phosphops.Entity.Status;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class InterventionDetailDTO {
    private Long idIntervention;
    private Status status;
    private Priorite priorite;
    private String nomEquipement;
    private String matriculeEquipement;
    private LocalDateTime datePanne;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String compteRendu;
    private List<PieceUtiliseeDTO> piecesUtilisees;
}