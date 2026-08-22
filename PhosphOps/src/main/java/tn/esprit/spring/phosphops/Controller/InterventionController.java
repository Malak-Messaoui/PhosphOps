package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.*;
import tn.esprit.spring.phosphops.Service.InterventionService;

import java.util.List;

@RestController
@RequestMapping("/interventions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InterventionController {

    private final InterventionService interventionService;

    @GetMapping("/mes-interventions")
    public List<InterventionDTO> mesInterventions(Authentication authentication) {
        String email = authentication.getName(); // adapte ken l JWT principal esm diff
        return interventionService.getMesInterventions(email);
    }

    @GetMapping("/{id}")
    public InterventionDetailDTO getDetail(@PathVariable Long id) {
        return interventionService.getDetail(id);
    }

    @PostMapping("/{id}/demarrer")
    public InterventionDetailDTO demarrer(@PathVariable Long id) {
        return interventionService.demarrer(id);
    }

    @PostMapping("/{id}/cloturer")
    public InterventionDetailDTO cloturer(@PathVariable Long id, @RequestBody ClotureRequestDTO request) {
        return interventionService.cloturer(id, request);
    }
}