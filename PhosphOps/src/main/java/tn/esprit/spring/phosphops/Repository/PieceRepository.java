package tn.esprit.spring.phosphops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.spring.phosphops.Entity.Piece;

import java.util.List;

public interface PieceRepository extends JpaRepository<Piece, Long> {
    List<Piece> findByNomContainingIgnoreCaseOrReferenceContainingIgnoreCase(String nom, String reference);
}