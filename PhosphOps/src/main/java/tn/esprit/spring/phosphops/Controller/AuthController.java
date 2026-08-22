package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.LoginRequest;
import tn.esprit.spring.phosphops.DTO.LoginResponse;
import tn.esprit.spring.phosphops.DTO.RegisterRequest;
import tn.esprit.spring.phosphops.Entity.Role;
import tn.esprit.spring.phosphops.Entity.User;
import tn.esprit.spring.phosphops.Repository.UserRepository;
import tn.esprit.spring.phosphops.Security.jwt.JwtService;
import tn.esprit.spring.phosphops.DTO.ForgotPasswordRequest;
import tn.esprit.spring.phosphops.DTO.OAuth2CompleteRequest;
import java.util.UUID;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Email ou mot de passe incorrect\"}");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse(
                token,
                user.getIdUser(),
                user.getEmail(),
                user.getName(),
                "ROLE_" + user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"error\": \"Cet email est déjà utilisé\"}");
        }

        User user = new User();
        user.setName(request.getNom());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.TECHNICIEN);
        user.setMatricule(request.getMatricule());
        user.setTelephone(request.getTelephone());
        user.setSite(request.getSite());
        user.setDepartement(request.getDepartement());

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse(
                token,
                user.getIdUser(),
                user.getEmail(),
                user.getName(),
                "ROLE_" + user.getRole().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"Aucun compte trouvé avec cet email\"}");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Le mot de passe doit contenir au moins 6 caractères\"}");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("{\"message\": \"Mot de passe réinitialisé avec succès\"}");
    }

    @PostMapping("/oauth2-complete")
    public ResponseEntity<?> completeOAuthRegistration(@RequestBody OAuth2CompleteRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"error\": \"Cet email est déjà utilisé\"}");
        }

        User user = new User();
        user.setName(request.getNom());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole(Role.TECHNICIEN);
        user.setMatricule(request.getMatricule());
        user.setTelephone(request.getTelephone());
        user.setSite(request.getSite());
        user.setDepartement(request.getDepartement());

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse(
                token,
                user.getIdUser(),
                user.getEmail(),
                user.getName(),
                "ROLE_" + user.getRole().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}