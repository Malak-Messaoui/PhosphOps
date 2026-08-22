package tn.esprit.spring.phosphops.ServiceImpl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.spring.phosphops.DTO.PersonnelDTO;
import tn.esprit.spring.phosphops.Entity.Personnel;
import tn.esprit.spring.phosphops.Repository.PersonnelRepository;
import tn.esprit.spring.phosphops.Service.PersonnelService;
import tn.esprit.spring.phosphops.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PersonnelIMPL implements PersonnelService {
    private final PersonnelRepository personnelRepository;

    private PersonnelDTO toDTO(Personnel personnel) {
        return PersonnelDTO.builder()
                .idPersonnel(personnel.getIdPersonnel())
                .fullName(personnel.getFullName())
                .email(personnel.getEmail())
                .matricule(personnel.getMatricule())
                .poste(personnel.getPoste())
                .build();
    }

    private Personnel toEntity(PersonnelDTO dto) {
        return Personnel.builder()
                .IdPersonnel(dto.getIdPersonnel())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .matricule(dto.getMatricule())
                .Poste(dto.getPoste())
                .build();
    }

    @Override
    public PersonnelDTO create(PersonnelDTO dto) {
        Personnel saved = personnelRepository.save(toEntity(dto));
        return toDTO(saved);
    }

    @Override
    public PersonnelDTO update(Long id, PersonnelDTO dto) {
        Personnel existing = personnelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel introuvable avec id : " + id));

        existing.setFullName(dto.getFullName());
        existing.setEmail(dto.getEmail());
        existing.setMatricule(dto.getMatricule());
        existing.setPoste(dto.getPoste());

        return toDTO(personnelRepository.save(existing));
    }

    @Override
    public PersonnelDTO getById(Long id) {
        Personnel personnel = personnelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personnel introuvable avec id : " + id));
        return toDTO(personnel);
    }

    @Override
    public List<PersonnelDTO> getAll() {
        return personnelRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!personnelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Personnel introuvable avec id : " + id);
        }
        personnelRepository.deleteById(id);
    }
}