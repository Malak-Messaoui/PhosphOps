package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PieceUtilisee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPieceUtilisee;

    @ManyToOne
    @JoinColumn(name = "id_intervention")
    private Intervention intervention;

    @ManyToOne
    @JoinColumn(name = "id_piece")
    private Piece piece;

    private Integer quantite;
}