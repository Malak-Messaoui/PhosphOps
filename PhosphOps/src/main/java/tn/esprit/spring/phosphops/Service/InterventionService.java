package tn.esprit.spring.phosphops.Service;

import tn.esprit.spring.phosphops.DTO.ClotureRequestDTO;
import tn.esprit.spring.phosphops.DTO.InterventionDTO;
import tn.esprit.spring.phosphops.DTO.InterventionDetailDTO;

import java.util.List;

public interface InterventionService {
    List<InterventionDTO> getMesInterventions(String emailTechnicien);
    InterventionDetailDTO getDetail(Long idIntervention);
    InterventionDetailDTO demarrer(Long idIntervention);
    InterventionDetailDTO cloturer(Long idIntervention, ClotureRequestDTO request);
}