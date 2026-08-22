package tn.esprit.spring.phosphops.Service;

import tn.esprit.spring.phosphops.DTO.DemandeMaintenanceDTO;
import tn.esprit.spring.phosphops.Entity.Panne;

import java.util.List;

public interface DemandeMaintenanceService {

    void creerDepuisPanne(Panne panne);

    List<DemandeMaintenanceDTO> getAll(String statut);   // statut nullable = pas de filtre

    DemandeMaintenanceDTO getById(Long id);

    DemandeMaintenanceDTO accepter(Long id);

    DemandeMaintenanceDTO refuser(Long id, String commentaire);

    DemandeMaintenanceDTO affecter(Long id, Long idTechnicien);

    List<DemandeMaintenanceDTO> getByTechnicien(Long idTechnicien);
}