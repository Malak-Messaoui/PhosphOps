package tn.esprit.spring.phosphops.ServiceImpl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.spring.phosphops.DTO.EquipementDTO;
import tn.esprit.spring.phosphops.Entity.Equipement;
import tn.esprit.spring.phosphops.Repository.EquipementRepository;
import tn.esprit.spring.phosphops.Service.EquipementService;
import tn.esprit.spring.phosphops.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EquipementIMPL implements EquipementService {

    private final EquipementRepository equipementRepository;

    private EquipementDTO toDTO(Equipement equipement) {
        return EquipementDTO.builder()
                .idEquipement(equipement.getIdEquipement())
                .matriculeEquipement(equipement.getMatriculeEquipement())
                .dateAchatEquipement(equipement.getDateAchatEquipement())
                .categorieEquipement(equipement.getCategorieEquipement())
                .etatEquipement(equipement.getEtatEquipement())
                .build();
    }

    private Equipement toEntity(EquipementDTO dto) {
        return Equipement.builder()
                .IdEquipement(dto.getIdEquipement())
                .MatriculeEquipement(dto.getMatriculeEquipement())
                .DateAchatEquipement(dto.getDateAchatEquipement())
                .CategorieEquipement(dto.getCategorieEquipement())
                .EtatEquipement(dto.getEtatEquipement())
                .build();
    }

    @Override
    public EquipementDTO create(EquipementDTO dto) {
        Equipement saved = equipementRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    @Override
    public EquipementDTO update(Long id, EquipementDTO dto) {
        Equipement existing = equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipement introuvable avec id : " + id));

        existing.setMatriculeEquipement(dto.getMatriculeEquipement());
        existing.setDateAchatEquipement(dto.getDateAchatEquipement());
        existing.setCategorieEquipement(dto.getCategorieEquipement());
        existing.setEtatEquipement(dto.getEtatEquipement());

        return toDTO(equipementRepository.save(existing));
    }

    @Override
    public EquipementDTO getById(Long id) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipement introuvable avec id : " + id));
        return toDTO(equipement);
    }

    @Override
    public List<EquipementDTO> getAll() {
        return equipementRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!equipementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipement introuvable avec id : " + id);
        }
        equipementRepository.deleteById(id);
    }
}
