package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter          // ← @Getter + @Setter au lieu de @Data
@Setter          // ← @Data cause des conflits avec @Builder
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Panne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long IdPanne;

    @Enumerated(EnumType.STRING)
    TypePanne TypePanne;
    String DescPanne;

    @Enumerated(EnumType.STRING)
    Priorite Priorite;
    LocalDateTime DatePanne;
    String MatriculeEquipement;

    String PhotoUrl;

    // --- Relation avec l'utilisateur qui a déclaré la panne ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    User user;
}