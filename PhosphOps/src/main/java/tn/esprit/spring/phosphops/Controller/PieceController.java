package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.PieceDTO;
import tn.esprit.spring.phosphops.Entity.Piece;
import tn.esprit.spring.phosphops.Repository.PieceRepository;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/pieces")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PieceController {

    private final PieceRepository pieceRepository;

    @GetMapping("/search")
    public List<PieceDTO> search(@RequestParam(defaultValue = "") String q) {
        List<Piece> pieces = q.isBlank()
                ? pieceRepository.findAll()
                : pieceRepository.findByNomContainingIgnoreCaseOrReferenceContainingIgnoreCase(q, q);

        return pieces.stream()
                .map(p -> PieceDTO.builder().idPiece(p.getIdPiece()).nom(p.getNom()).reference(p.getReference()).build())
                .collect(Collectors.toList());
    }
}