package tn.esprit.spring.phosphops.ServiceImpl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.spring.phosphops.DTO.DemandeMaintenanceDTO;
import tn.esprit.spring.phosphops.Entity.*;
import tn.esprit.spring.phosphops.Repository.DemandeMaintenanceRepository;
import tn.esprit.spring.phosphops.Repository.UserRepository;
import tn.esprit.spring.phosphops.Service.DemandeMaintenanceService;
import tn.esprit.spring.phosphops.exception.ResourceNotFoundException;
import tn.esprit.spring.phosphops.Repository.InterventionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DemandeMaintenanceIMPL implements DemandeMaintenanceService {

    private final DemandeMaintenanceRepository demandeRepository;
    private final UserRepository userRepository;
    private final InterventionRepository interventionRepository;

    private DemandeMaintenanceDTO toDTO(DemandeMaintenance d) {
        return DemandeMaintenanceDTO.builder()
                .idDemande(d.getIdDemande())
                .idPanne(d.getPanne() != null ? d.getPanne().getIdPanne() : null)
                .matriculeEquipement(d.getPanne() != null ? d.getPanne().getMatriculeEquipement() : null)
                .typePanne(d.getPanne() != null ? d.getPanne().getTypePanne() : null)
                .descPanne(d.getPanne() != null ? d.getPanne().getDescPanne() : null)
                .priorite(d.getPanne() != null ? d.getPanne().getPriorite() : null)
                .photoUrl(d.getPanne() != null ? d.getPanne().getPhotoUrl() : null)
                .idTechnicien(d.getTechnicien() != null ? d.getTechnicien().getIdUser() : null)
                .nomTechnicien(d.getTechnicien() != null ? d.getTechnicien().getName() : null)
                .status(d.getStatus() != null ? d.getStatus().name() : null)
                .dateDemande(d.getDateDemande())
                .commentaireAdmin(d.getCommentaireAdmin())
                .build();
    }

    @Override
    public void creerDepuisPanne(Panne panne) {
        DemandeMaintenance demande = DemandeMaintenance.builder()
                .panne(panne)
                .status(Status.EN_ATTENTE)
                .dateDemande(LocalDateTime.now())
                .build();
        demandeRepository.save(demande);
    }

    @Override
    public List<DemandeMaintenanceDTO> getAll(String statut) {
        List<DemandeMaintenance> demandes;

        if (statut != null && !statut.isBlank()) {
            Status statutEnum = Status.valueOf(statut.toUpperCase());
            demandes = demandeRepository.findByStatus(statutEnum);   // ← changé ici
        } else {
            demandes = demandeRepository.findAll();
        }

        return demandes.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public DemandeMaintenanceDTO getById(Long id) {
        DemandeMaintenance d = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable avec id : " + id));
        return toDTO(d);
    }

    @Override
    public DemandeMaintenanceDTO accepter(Long id) {
        DemandeMaintenance d = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable avec id : " + id));

        d.setStatus(Status.ACCEPTEE);
        return toDTO(demandeRepository.save(d));
    }

    @Override
    public DemandeMaintenanceDTO refuser(Long id, String commentaire) {
        DemandeMaintenance d = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable avec id : " + id));

        d.setStatus(Status.REFUSEE);
        d.setCommentaireAdmin(commentaire);
        return toDTO(demandeRepository.save(d));
    }

    @Override
    public DemandeMaintenanceDTO affecter(Long id, Long idTechnicien) {
        DemandeMaintenance d = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable avec id : " + id));

        User technicien = userRepository.findById(idTechnicien)
                .orElseThrow(() -> new ResourceNotFoundException("Technicien introuvable avec id : " + idTechnicien));

        d.setTechnicien(technicien);
        d.setStatus(Status.AFFECTEE);
        DemandeMaintenanceDTO dto = toDTO(demandeRepository.save(d));

        // création automatique de l'intervention liée
        Intervention intervention = Intervention.builder()
                .panne(d.getPanne())
                .technicien(technicien)
                .status(Status.PLANIFIEE)
                .build();
        interventionRepository.save(intervention);

        return dto;
    }

    @Override
    public List<DemandeMaintenanceDTO> getByTechnicien(Long idTechnicien) {
        return demandeRepository.findByTechnicien_IdUser(idTechnicien)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
}