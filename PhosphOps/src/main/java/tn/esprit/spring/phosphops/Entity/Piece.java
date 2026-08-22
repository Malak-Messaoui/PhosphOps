package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Piece {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPiece;

    private String nom;        // "Joint mécanique DN50"
    private String reference;  // "JM-DN50-KSB"

    @Builder.Default
    private Integer quantiteStock = 0;
}