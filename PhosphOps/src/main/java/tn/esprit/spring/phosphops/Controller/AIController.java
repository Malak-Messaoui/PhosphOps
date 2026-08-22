package tn.esprit.spring.phosphops.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.phosphops.DTO.ChatRequestDTO;
import tn.esprit.spring.phosphops.DTO.ChatResponseDTO;
import tn.esprit.spring.phosphops.DTO.DiagnosticRequestDTO;
import tn.esprit.spring.phosphops.DTO.DiagnosticResponseDTO;
import tn.esprit.spring.phosphops.ServiceImpl.AIIMPL;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIIMPL aiService;

    @PostMapping("/diagnostic")
    public DiagnosticResponseDTO getDiagnostic(@RequestBody DiagnosticRequestDTO requestDTO) {
        return aiService.getDiagnostic(requestDTO);
    }

    @PostMapping("/chat")
    public ChatResponseDTO chat(@RequestBody ChatRequestDTO requestDTO) {
        String reponse = aiService.chat(requestDTO.getMessage());
        return new ChatResponseDTO(reponse);
    }
}