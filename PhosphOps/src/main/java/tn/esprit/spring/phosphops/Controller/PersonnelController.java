package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.PersonnelDTO;
import tn.esprit.spring.phosphops.Service.PersonnelService;

import java.util.List;

@RestController
@RequestMapping("/api/personnels")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PersonnelController {

    private final PersonnelService personnelService;

    @PostMapping
    public ResponseEntity<PersonnelDTO> create(@RequestBody PersonnelDTO dto) {
        return new ResponseEntity<>(personnelService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonnelDTO> update(@PathVariable Long id, @RequestBody PersonnelDTO dto) {
        return ResponseEntity.ok(personnelService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonnelDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(personnelService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<PersonnelDTO>> getAll() {
        return ResponseEntity.ok(personnelService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        personnelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
