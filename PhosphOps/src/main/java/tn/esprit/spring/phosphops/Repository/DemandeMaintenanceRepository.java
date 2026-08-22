package tn.esprit.spring.phosphops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.spring.phosphops.Entity.DemandeMaintenance;
import tn.esprit.spring.phosphops.Entity.Status;

import java.util.List;

public interface DemandeMaintenanceRepository extends JpaRepository<DemandeMaintenance, Long> {
    List<DemandeMaintenance> findByStatus(Status status);
    List<DemandeMaintenance> findByTechnicien_IdUser(Long idTechnicien);
}