package tn.esprit.spring.phosphops.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class DiagnosticResponseDTO {
    private List<String> causesProbables;
    private List<String> piecesAVerifier;
    private String conseilGeneral;
}