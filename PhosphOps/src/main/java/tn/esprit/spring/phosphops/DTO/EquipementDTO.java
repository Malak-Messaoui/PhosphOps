package tn.esprit.spring.phosphops.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipementDTO {
    private Long idEquipement;
    private String matriculeEquipement;
    private LocalDateTime dateAchatEquipement;
    private String categorieEquipement;
    private String etatEquipement;
}