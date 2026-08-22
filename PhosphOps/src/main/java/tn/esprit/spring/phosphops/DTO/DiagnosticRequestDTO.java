package tn.esprit.spring.phosphops.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosticRequestDTO {
    private String description;
    private String photoUrl; // optionnel, Cloudinary URL
}