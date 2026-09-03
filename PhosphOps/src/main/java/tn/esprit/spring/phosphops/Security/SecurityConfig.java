package tn.esprit.spring.phosphops.Security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tn.esprit.spring.phosphops.Repository.UserRepository;
import tn.esprit.spring.phosphops.Security.jwt.JwtAuthFilter;
import tn.esprit.spring.phosphops.Security.jwt.JwtService;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthFilter jwtAuthFilter;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider p =
                new DaoAuthenticationProvider(userDetailsService);

        p.setPasswordEncoder(passwordEncoder);

        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationSuccessHandler oAuth2AuthSuccessHandler() {
        return new OAuth2AuthSuccessHandler(userRepository, jwtService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            @Qualifier("authProvider")
            DaoAuthenticationProvider daoAuthProvider,
            AuthenticationSuccessHandler oAuth2AuthSuccessHandler
    ) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )
                .csrf(AbstractHttpConfigurer::disable)

                .authenticationProvider(daoAuthProvider)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        .requestMatchers("/auth/**")
                        .permitAll()

                        .requestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/personnels",
                                "/api/personnels/**"
                        )
                        .permitAll()

                        .requestMatchers("/api/equipements/**")
                        .permitAll()

                        .requestMatchers("/api/users/**")
                        .hasAnyRole("ADMIN", "USER", "TECHNICIEN")

                        .requestMatchers("/api/demandes/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN")

                        .requestMatchers("/ai/**")
                        .permitAll()

                        .anyRequest()
                        .authenticated()
                )

                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(
                                (request, response, authException) -> {

                                    response.setStatus(
                                            HttpServletResponse.SC_UNAUTHORIZED
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.getWriter().write(
                                            "{\"error\": \"Unauthorized\"}"
                                    );
                                }
                        )
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .oauth2Login(oauth2 -> oauth2

                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(
                                        customOAuth2UserService
                                )
                        )

                        .successHandler(oAuth2AuthSuccessHandler)

                        .failureHandler(
                                (request, response, exception) -> {
                                    response.sendRedirect(
                                            frontendUrl
                                                    + "/login?error="
                                                    + exception.getMessage()
                                    );
                                }
                        )
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.stream(allowedOrigins.split(","))
                        .map(String::trim)
                        .toList()
        );

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}