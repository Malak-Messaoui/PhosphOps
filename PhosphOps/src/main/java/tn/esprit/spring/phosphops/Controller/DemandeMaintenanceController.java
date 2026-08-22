package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.DemandeMaintenanceDTO;
import tn.esprit.spring.phosphops.Service.DemandeMaintenanceService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DemandeMaintenanceController {

    private final DemandeMaintenanceService demandeService;

    @GetMapping
    public ResponseEntity<List<DemandeMaintenanceDTO>> getAll(
            @RequestParam(required = false) String statut) {
        return ResponseEntity.ok(demandeService.getAll(statut));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandeMaintenanceDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.getById(id));
    }

    @PutMapping("/{id}/accepter")
    public ResponseEntity<DemandeMaintenanceDTO> accepter(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.accepter(id));
    }

    @PutMapping("/{id}/refuser")
    public ResponseEntity<DemandeMaintenanceDTO> refuser(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String commentaire = body != null ? body.get("commentaire") : null;
        return ResponseEntity.ok(demandeService.refuser(id, commentaire));
    }

    @PutMapping("/{id}/affecter")
    public ResponseEntity<DemandeMaintenanceDTO> affecter(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(demandeService.affecter(id, body.get("idTechnicien")));
    }

    @GetMapping("/technicien/{idTechnicien}")
    public ResponseEntity<List<DemandeMaintenanceDTO>> getByTechnicien(@PathVariable Long idTechnicien) {
        return ResponseEntity.ok(demandeService.getByTechnicien(idTechnicien));
    }
}