package com.labor.registration.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CategoryRequest {
    @NotBlank
    private String name;
    private String description;
}
