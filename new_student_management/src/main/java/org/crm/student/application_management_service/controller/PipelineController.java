package org.crm.student.application_management_service.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin(origins = "*")
@Controller
public class PipelineController {

    @GetMapping("/pipeline")
    public String showPipelinePage() {
        return "pipeline";
    }
}
