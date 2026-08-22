package tn.esprit.spring.phosphops.ServiceImpl;
import tn.esprit.spring.phosphops.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.spring.phosphops.DTO.PanneDTO;
import tn.esprit.spring.phosphops.Entity.Panne;
import tn.esprit.spring.phosphops.Entity.User;
import tn.esprit.spring.phosphops.Repository.PanneRepository;
import tn.esprit.spring.phosphops.Repository.UserRepository;
import tn.esprit.spring.phosphops.Service.DemandeMaintenanceService;
import tn.esprit.spring.phosphops.ServiceImpl.CloudinaryService;
import tn.esprit.spring.phosphops.Service.PanneService;


import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PanneIMPL implements PanneService {

    private final PanneRepository panneRepository;
    private final CloudinaryService cloudinaryService;
    private final DemandeMaintenanceService demandeMaintenanceService;
    private final UserRepository userRepository;   // ← nouveau, bech njibou l'utilisateur connecté

    private PanneDTO toDTO(Panne panne) {
        return PanneDTO.builder()
                .idPanne(panne.getIdPanne())
                .typePanne(panne.getTypePanne())
                .descPanne(panne.getDescPanne())
                .priorite(panne.getPriorite())
                .datePanne(panne.getDatePanne())
                .matriculeEquipement(panne.getMatriculeEquipement())
                .photoUrl(panne.getPhotoUrl())
                .nomDeclarant(panne.getUser() != null ? panne.getUser().getName() : null)
                .siteDeclarant(panne.getUser() != null ? panne.getUser().getSite() : null)
                .departementDeclarant(panne.getUser() != null ? panne.getUser().getDepartement() : null)
                .build();
    }

    // ← zeydin l'utilisateur comme paramètre, mouch reference lel variable li mayelmech منين تجي
    private Panne toEntity(PanneDTO dto, User utilisateurConnecte) {
        return Panne.builder()
                .IdPanne(dto.getIdPanne())
                .TypePanne(dto.getTypePanne())
                .DescPanne(dto.getDescPanne())
                .Priorite(dto.getPriorite())
                .DatePanne(dto.getDatePanne())
                .MatriculeEquipement(dto.getMatriculeEquipement())
                .PhotoUrl(dto.getPhotoUrl())
                .user(utilisateurConnecte)
                .build();
    }

    // ← njibou l'utilisateur mel JWT (SecurityContext), houwa l-email/username li 7attitou fel token
    private User getUtilisateurConnecte() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));
    }

    @Override
    public PanneDTO create(PanneDTO dto, MultipartFile photo) {
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = cloudinaryService.uploadImage(photo);
        }
        dto.setPhotoUrl(photoUrl);
        dto.setDatePanne(java.time.LocalDateTime.now());

        User utilisateurConnecte = getUtilisateurConnecte();   // ← njibouh hna

        Panne saved = panneRepository.save(toEntity(dto, utilisateurConnecte));

        demandeMaintenanceService.creerDepuisPanne(saved);

        return toDTO(saved);
    }

    @Override
    public PanneDTO update(Long id, PanneDTO dto) {
        Panne existing = panneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Panne introuvable avec id : " + id));

        existing.setTypePanne(dto.getTypePanne());
        existing.setDescPanne(dto.getDescPanne());
        existing.setPriorite(dto.getPriorite());
        existing.setDatePanne(dto.getDatePanne());
        existing.setMatriculeEquipement(dto.getMatriculeEquipement());

        return toDTO(panneRepository.save(existing));
    }

    @Override
    public PanneDTO getById(Long id) {
        Panne panne = panneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Panne introuvable avec id : " + id));
        return toDTO(panne);
    }

    @Override
    public List<PanneDTO> getAll() {
        return panneRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!panneRepository.existsById(id)) {
            throw new ResourceNotFoundException("Panne introuvable avec id : " + id);
        }
        panneRepository.deleteById(id);
    }
}