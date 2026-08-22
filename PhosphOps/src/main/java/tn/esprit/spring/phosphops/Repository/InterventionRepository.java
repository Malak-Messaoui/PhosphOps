package tn.esprit.spring.phosphops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.spring.phosphops.Entity.Intervention;
import tn.esprit.spring.phosphops.Entity.User;

import java.util.List;
import java.util.Optional;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByTechnicien(User technicien);
    @Query("SELECT i FROM Intervention i LEFT JOIN FETCH i.piecesUtilisees WHERE i.id = :id")
    Optional<Intervention> findByIdWithPieces(@Param("id") Long id);
}