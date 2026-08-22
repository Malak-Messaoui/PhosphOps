package tn.esprit.spring.phosphops.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.ChangePasswordRequest;
import tn.esprit.spring.phosphops.DTO.ProfileResponse;
import tn.esprit.spring.phosphops.DTO.ProfileUpdateRequest;
import tn.esprit.spring.phosphops.DTO.UserDTO;
import tn.esprit.spring.phosphops.Entity.Role;
import tn.esprit.spring.phosphops.Entity.User;
import tn.esprit.spring.phosphops.Repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {



    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    @GetMapping("/{id}")
    public ProfileResponse getProfile(@PathVariable Long id){


        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable")
                );


        return new ProfileResponse(

                user.getIdUser(),

                user.getName(),

                user.getEmail(),

                "ROLE_" + user.getRole().name(),

                user.getMatricule(),

                user.getTelephone(),

                user.getDepartement(),

                user.getSite(),

                user.getDateEntree()

        );

    }

    @PutMapping("/{id}")
    public ProfileResponse updateProfile(
            @PathVariable Long id,
            @RequestBody ProfileUpdateRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setName(request.getNom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setDepartement(request.getDepartement());
        user.setSite(request.getSite());

        userRepository.save(user);

        return new ProfileResponse(
                user.getIdUser(),
                user.getName(),
                user.getEmail(),
                "ROLE_" + user.getRole().name(),
                user.getMatricule(),
                user.getTelephone(),
                user.getDepartement(),
                user.getSite(),
                user.getDateEntree()
        );
    }
    @GetMapping("/techniciens")
    public List<UserDTO> getTechniciens() {
        return userRepository.findByRole(Role.TECHNICIEN)
                .stream()
                .map(u -> new UserDTO(
                        u.getIdUser(),
                        u.getName(),
                        u.getRole()
                ))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // 1. Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("error", "Ancien mot de passe incorrect"));
        }

        // 2. (optionnel) Refuser si le nouveau mdp == l'ancien
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(400)
                    .body(Map.of("error", "Le nouveau mot de passe doit être différent"));
        }

        // 3. Encoder et sauvegarder
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès"));
    }

}