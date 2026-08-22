package tn.esprit.spring.phosphops.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter          // ← @Getter + @Setter au lieu de @Data
@Setter          // ← @Data cause des conflits avec @Builder
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long IdEquipement;
    String MatriculeEquipement;
    LocalDateTime DateAchatEquipement;
    String CategorieEquipement;
    String EtatEquipement;
}
