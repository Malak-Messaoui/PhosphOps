package tn.esprit.spring.phosphops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.spring.phosphops.Entity.Personnel;

public interface PersonnelRepository extends JpaRepository<Personnel, Long> {
}
