package tn.esprit.spring.phosphops.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.spring.phosphops.DTO.DiagnosticRequestDTO;
import tn.esprit.spring.phosphops.DTO.DiagnosticResponseDTO;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIIMPL {

    private final GeminiService geminiService;

    public DiagnosticResponseDTO getDiagnostic(DiagnosticRequestDTO requestDTO) {
        String prompt = """
                Tu es un assistant technique pour la maintenance industrielle dans une usine de phosphate.
                Voici la description d'une panne signalée par un technicien:
                "%s"

                Réponds STRICTEMENT dans ce format (rien d'autre):
                CAUSES: cause1 | cause2 | cause3
                PIECES: piece1 | piece2
                CONSEIL: un conseil court en une phrase
                """.formatted(requestDTO.getDescription());

        String rawResponse = geminiService.askGemini(prompt);

        return parseDiagnosticResponse(rawResponse);
    }

    public String chat(String message) {
        String prompt = """
                Tu es un assistant support pour les techniciens de maintenance sur la plateforme PhosphOps.
                Réponds de manière courte, claire et professionnelle à cette question:
                "%s"
                """.formatted(message);

        return geminiService.askGemini(prompt);
    }

    private DiagnosticResponseDTO parseDiagnosticResponse(String raw) {
        List<String> causes = List.of();
        List<String> pieces = List.of();
        String conseil = "";

        for (String line : raw.split("\n")) {
            line = line.trim();
            if (line.startsWith("CAUSES:")) {
                causes = Arrays.asList(line.replace("CAUSES:", "").trim().split("\\|"));
            } else if (line.startsWith("PIECES:")) {
                pieces = Arrays.asList(line.replace("PIECES:", "").trim().split("\\|"));
            } else if (line.startsWith("CONSEIL:")) {
                conseil = line.replace("CONSEIL:", "").trim();
            }
        }

        return DiagnosticResponseDTO.builder()
                .causesProbables(causes.stream().map(String::trim).toList())
                .piecesAVerifier(pieces.stream().map(String::trim).toList())
                .conseilGeneral(conseil)
                .build();
    }
}