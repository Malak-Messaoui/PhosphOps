package tn.esprit.spring.phosphops.DTO;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClotureRequestDTO {
    private String compteRendu;
    private List<PieceUtiliseeDTO> pieces; // idPiece + quantite ghir el mohem
}