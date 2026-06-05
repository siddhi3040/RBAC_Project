package com.rbac.dto;

import com.rbac.entity.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
