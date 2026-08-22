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
public class PanneDTO {
    private Long idPanne;
    private TypePanne typePanne;
    private String descPanne;
    private Priorite priorite;
    private LocalDateTime datePanne;
    private String matriculeEquipement;

    private String photoUrl;

    // --- Infos du technicien qui a déclaré la panne ---
    private String nomDeclarant;
    private String siteDeclarant;
    private String departementDeclarant;
}