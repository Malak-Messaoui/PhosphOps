package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.spring.phosphops.DTO.PanneDTO;
import tn.esprit.spring.phosphops.Service.PanneService;

import java.util.List;

@RestController
@RequestMapping("/api/pannes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PanneController {

    private final PanneService panneService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PanneDTO> create(
            @RequestPart("panne") PanneDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        return new ResponseEntity<>(panneService.create(dto, photo), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PanneDTO> update(@PathVariable Long id, @RequestBody PanneDTO dto) {
        return ResponseEntity.ok(panneService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PanneDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(panneService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<PanneDTO>> getAll() {
        return ResponseEntity.ok(panneService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        panneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}