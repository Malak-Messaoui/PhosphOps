package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeMaintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idDemande;

    @OneToOne
    @JoinColumn(name = "id_panne")
    Panne panne;

    @ManyToOne
    @JoinColumn(name = "id_technicien")
    User technicien;   // null tant que pas affectée

    @Enumerated(EnumType.STRING)
    Status status;

    LocalDateTime dateDemande;

    String commentaireAdmin;   // raison du refus (optionnel)
}
