package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter          // ← @Getter + @Setter au lieu de @Data
@Setter          // ← @Data cause des conflits avec @Builder
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personnel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long IdPersonnel;
    String fullName;
    String email;
    String matricule;

    @Enumerated(EnumType.STRING)
    Poste Poste;

}
