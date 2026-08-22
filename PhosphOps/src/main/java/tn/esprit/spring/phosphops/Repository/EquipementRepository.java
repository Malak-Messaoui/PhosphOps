package tn.esprit.spring.phosphops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.spring.phosphops.Entity.Equipement;

public interface EquipementRepository extends JpaRepository<Equipement, Long> {
}
