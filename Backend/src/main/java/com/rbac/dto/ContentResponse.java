package com.rbac.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContentResponse {
    private String message;
    private String data;
}
