package tn.esprit.spring.phosphops.Service;

import tn.esprit.spring.phosphops.DTO.EquipementDTO;

import java.util.List;

public interface EquipementService {
    EquipementDTO create(EquipementDTO dto);
    EquipementDTO update(Long id, EquipementDTO dto);
    EquipementDTO getById(Long id);
    List<EquipementDTO> getAll();
    void delete(Long id);
}
