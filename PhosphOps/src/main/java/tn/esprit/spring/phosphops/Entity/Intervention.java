package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idIntervention;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    @Column(length = 2000)
    private String compteRendu;

    @OneToOne
    @JoinColumn(name = "id_panne", unique = true)
    private Panne panne;

    @ManyToOne
    @JoinColumn(name = "id_technicien")
    private User technicien;

    @Builder.Default
    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PieceUtilisee> piecesUtilisees = new ArrayList<>();
}