package com.rbac.controller;

import com.rbac.dto.ContentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Content", description = "Role-protected content endpoints")
public class ContentController {

    @GetMapping("/public")
    @Operation(summary = "Public content — no authentication required")
    public ResponseEntity<ContentResponse> getPublicContent() {
        return ResponseEntity.ok(new ContentResponse(
                "Welcome! This is public content accessible by everyone.",
                "No authentication required to view this content."
        ));
    }

    @GetMapping("/user")
    @Operation(summary = "User-level content — requires USER or ADMIN role",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ContentResponse> getUserContent(Authentication authentication) {
        return ResponseEntity.ok(new ContentResponse(
                "Hello, " + authentication.getName() + ". You have USER-level access.",
                "This content is available to authenticated users with USER or ADMIN role."
        ));
    }

    @GetMapping("/admin")
    @Operation(summary = "Admin-level content — requires ADMIN role only",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ContentResponse> getAdminContent(Authentication authentication) {
        return ResponseEntity.ok(new ContentResponse(
                "Welcome, Admin " + authentication.getName() + ". Full administrative access granted.",
                "This is restricted ADMIN-only content. You have elevated privileges."
        ));
    }
}
