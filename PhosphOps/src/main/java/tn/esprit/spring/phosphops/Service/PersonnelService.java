package tn.esprit.spring.phosphops.Service;

import tn.esprit.spring.phosphops.DTO.PersonnelDTO;

import java.util.List;

public interface PersonnelService {
    PersonnelDTO create(PersonnelDTO dto);
    PersonnelDTO update(Long id, PersonnelDTO dto);
    PersonnelDTO getById(Long id);
    List<PersonnelDTO> getAll();
    void delete(Long id);
}
