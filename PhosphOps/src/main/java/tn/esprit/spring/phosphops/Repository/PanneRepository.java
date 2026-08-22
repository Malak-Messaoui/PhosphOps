package tn.esprit.spring.phosphops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.spring.phosphops.Entity.Panne;

public interface PanneRepository extends JpaRepository<Panne,Long> {
}
