package tn.esprit.spring.phosphops.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PieceUtiliseeDTO {
    private Long idPiece;
    private String nom;
    private String reference;
    private Integer quantite;
}