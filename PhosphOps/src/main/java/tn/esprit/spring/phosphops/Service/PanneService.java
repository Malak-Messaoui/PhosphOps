package tn.esprit.spring.phosphops.Service;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.spring.phosphops.DTO.PanneDTO;

import java.util.List;

public interface PanneService {

    PanneDTO create(PanneDTO dto, MultipartFile photo);
    PanneDTO update(Long id, PanneDTO dto);
    PanneDTO getById(Long id);
    List<PanneDTO> getAll();
    void delete(Long id);
}
