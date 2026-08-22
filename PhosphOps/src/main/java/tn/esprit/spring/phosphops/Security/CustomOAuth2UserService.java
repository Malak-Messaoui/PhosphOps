package tn.esprit.spring.phosphops.Security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import tn.esprit.spring.phosphops.Entity.User;
import tn.esprit.spring.phosphops.Repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. Récupère les infos depuis Google
        OAuth2User oauth2User = super.loadUser(userRequest);
        String email = oauth2User.getAttribute("email");

        // 2. On NE bloque PLUS ici si l'email n'existe pas encore :
        //    c'est le successHandler qui décide (redirection vers select-role
        //    si nouveau, génération du JWT si le compte existe déjà).
        Optional<User> existingUser = userRepository.findByEmail(email);

        List<SimpleGrantedAuthority> authorities = existingUser
                .map(u -> List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name())))
                .orElse(List.of(new SimpleGrantedAuthority("ROLE_NEW_OAUTH2_USER")));

        // 3. Retourne un OAuth2User avec les attributs Google + le rôle (existant ou provisoire)
        return new DefaultOAuth2User(
                authorities,
                oauth2User.getAttributes(),
                "email"
        );
    }
}