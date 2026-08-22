package tn.esprit.spring.phosphops.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.spring.phosphops.DTO.*;
import tn.esprit.spring.phosphops.Entity.*;
import tn.esprit.spring.phosphops.Repository.InterventionRepository;
import tn.esprit.spring.phosphops.Repository.PieceRepository;
import tn.esprit.spring.phosphops.Repository.UserRepository; // adapte l'nom ken diff
import tn.esprit.spring.phosphops.Service.InterventionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InterventionIMPL implements InterventionService {

    private final InterventionRepository interventionRepository;
    private final PieceRepository pieceRepository;
    private final UserRepository userRepository;

    @Override
    public List<InterventionDTO> getMesInterventions(String emailTechnicien) {
        User technicien = userRepository.findByEmail(emailTechnicien)
                .orElseThrow(() -> new RuntimeException("Technicien introuvable"));

        return interventionRepository.findByTechnicien(technicien)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InterventionDetailDTO getDetail(Long idIntervention) {
        Intervention intervention = interventionRepository.findById(idIntervention)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));
        return toDetailDTO(intervention);
    }

    @Override
    public InterventionDetailDTO demarrer(Long idIntervention) {
        Intervention intervention = interventionRepository.findById(idIntervention)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));

        intervention.setStatus(Status.EN_COURS);
        intervention.setDateDebut(LocalDateTime.now());
        interventionRepository.save(intervention);

        return toDetailDTO(intervention);
    }

    @Override
    public InterventionDetailDTO cloturer(Long idIntervention, ClotureRequestDTO request) {
        Intervention intervention = interventionRepository.findById(idIntervention)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));

        intervention.setCompteRendu(request.getCompteRendu());
        intervention.setStatus(Status.TERMINEE);
        intervention.setDateFin(LocalDateTime.now());

        intervention.getPiecesUtilisees().clear();
        if (request.getPieces() != null) {
            request.getPieces().forEach(p -> {
                Piece piece = pieceRepository.findById(p.getIdPiece())
                        .orElseThrow(() -> new RuntimeException("Piece introuvable"));
                PieceUtilisee pu = PieceUtilisee.builder()
                        .intervention(intervention)
                        .piece(piece)
                        .quantite(p.getQuantite())
                        .build();
                intervention.getPiecesUtilisees().add(pu);
            });
        }

        interventionRepository.save(intervention);
        return toDetailDTO(intervention);
    }

    // ---- mapping helpers ----
    private InterventionDTO toDTO(Intervention i) {
        Panne panne = i.getPanne();
        return InterventionDTO.builder()
                .idIntervention(i.getIdIntervention())
                .status(i.getStatus())
                .priorite(panne.getPriorite())
                .nomEquipement(panne.getMatriculeEquipement())
                .matriculeEquipement(panne.getMatriculeEquipement())
                .datePanne(panne.getDatePanne())
                .build();
    }

    private InterventionDetailDTO toDetailDTO(Intervention i) {
        Panne panne = i.getPanne();
        List<PieceUtiliseeDTO> pieces = i.getPiecesUtilisees().stream()
                .map(pu -> PieceUtiliseeDTO.builder()
                        .idPiece(pu.getPiece().getIdPiece())
                        .nom(pu.getPiece().getNom())
                        .reference(pu.getPiece().getReference())
                        .quantite(pu.getQuantite())
                        .build())
                .collect(Collectors.toList());

        return InterventionDetailDTO.builder()
                .idIntervention(i.getIdIntervention())
                .status(i.getStatus())
                .priorite(panne.getPriorite())
                .nomEquipement(panne.getMatriculeEquipement())
                .matriculeEquipement(panne.getMatriculeEquipement())
                .datePanne(panne.getDatePanne())
                .dateDebut(i.getDateDebut())
                .dateFin(i.getDateFin())
                .compteRendu(i.getCompteRendu())
                .piecesUtilisees(pieces)
                .build();
    }
}